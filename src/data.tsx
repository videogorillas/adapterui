import {CompositeDisposable, Observable, Observer, Subject} from "rx";
import * as Cloud from "vgcloudapi";
import {Job, Media} from "vgcloudapi";
import * as BigFoot from 'bfapi';

export class ConStatus {
    public connstatus: Cloud.ConnectionStatus;
    public updated: Date;

    constructor(s: Cloud.ConnectionStatus) {
        this.connstatus = s;
        this.updated = new Date();
    }
}

export class DashBoardDataSource {
    private liveUpdate: Cloud.LiveUpdate;
    private cloud: Cloud.CloudServicesV2;
    private bf: BigFoot.ApiClient;
    private subs: CompositeDisposable;

    private mediaUpdates: Subject<Media>;
    private projectUpdates: Subject<BigFoot.Project>;
    private jobUpdates: Subject<Job>;
    private statusUpdates: Subject<Cloud.ConnectionStatus>;

    public jobs: Map<string, Job> = new Map();
    public media: Map<string, Media> = new Map();
    public projects: Map<string, BigFoot.Project> = new Map();

    public status: ConStatus = new ConStatus(Cloud.ConnectionStatus.OFFLINE);

    constructor(host: string) {
        let liveUpdate = new Cloud.LiveUpdate("ws://" + host + "/ws/api");
        let cloud = new Cloud.CloudServicesV2("http://" + host);
        let bf = new BigFoot.ApiClient("http://" + host);
        
        this.liveUpdate = liveUpdate;
        this.cloud = cloud;
        this.bf = bf;
        this.subs = new CompositeDisposable();
        this.mediaUpdates = new Subject<Media>();
        this.subs.add(this.liveUpdate.getMediaRx().subscribe(m=> {
            this.media.set(m.id, m);
            this.mediaUpdates.onNext(m);
        }));

        this.jobUpdates = new Subject<Job>();
        this.subs.add(this.liveUpdate.getJobRx().subscribe(j => {
            this.jobs.set(j.id, j);
            this.jobUpdates.onNext(j)
        }));


        this.projectUpdates = new Subject<BigFoot.Project>();
        let projectsO: Observable<BigFoot.Project> = Observable.just(1).merge(Observable.interval(15000))
            .concatMap(bf.listProjectIds())
            .concatMap(list => {
                return Observable.from(list);
            })
            .concatMap(pId => {
                return bf.getProjById(pId);
            });
        this.subs.add(projectsO
            .doOnError(e => {
                console.error("projects list req", e);
            })
            .retryWhen(o => {
                return o.delay(3000)
            })
            .subscribe(p => {
                this.projects.set(p.id, p);
                this.projectUpdates.onNext(p);
            }));

        this.statusUpdates = new Subject<Cloud.ConnectionStatus>();
        this.subs.add(this.liveUpdate.getStatusRx()
            .subscribe(con => {
                // con = OFFLINE, CONNECTING, ONLINE
                this.status = new ConStatus(con);
                this.statusUpdates.onNext(con);
            }));


        this.subs.add(this.projectUpdates.concatMap(p => {
            return this.cloud.loadMedia(p.masterId).concatMap(m => {
                this.media.set(m.id, m);
                this.mediaUpdates.onNext(m);

                return Observable.from(m.getJobIds()).flatMap(jobid => {
                    let job = this.jobs.get(jobid);
                    if (job != null && job.isFinished) {
                        // not gonna change when its finished. don't care
                        return Observable.just(job);
                    } else {
                        return this.cloud.loadJob(jobid).doOnNext(j => {
                            this.jobs.set(j.id, j);
                            this.jobUpdates.onNext(j);
                        });
                    }
                });
            });
        }).subscribe(jobupdate => {
        }));

        this.liveUpdate.connect();
    }

    public mediaRx(): Observable<Media> {
        return this.mediaUpdates;
    }

    public projectRx(): Observable<BigFoot.Project> {
        return this.projectUpdates;
    }

    public jobRx(): Observable<Job> {
        return this.jobUpdates;
    }

    public statusRx(): Observable<Cloud.ConnectionStatus> {
        return this.statusUpdates;
    }

    public isOffline() {
        return this.status.connstatus == Cloud.ConnectionStatus.OFFLINE;
    }

    public fddProgress(mediaId: string): number {
        let media: Media = this.media.get(mediaId);
        if (media == null) {
            return -1;
        }

        let progress = 0;
        let durSec = -1;
        media.getJobIds()
            .map(jobid => this.jobs.get(jobid))
            .filter(j => j != null && j.command == Cloud.Job.FDD)
            .forEach(job => {
                durSec = job.durationSec + durSec;
                progress = job.progress + progress;
            });

        return Math.round(progress * 100. / durSec);
    }

    public proxyPackageProgress(mediaId: string): number {
        let media: Media = this.media.get(mediaId);
        if (media == null) {
            return -1;
        }

        // Cloud.Job.FDD,
        let proxyCmds = [Cloud.Job.MAKEDASH, Cloud.Job.MAKEHLS, Cloud.Job.SEGMENTER];

        let progress = 0;
        let durSec = -1;
        Observable.from(media.getJobIds())
            .map(jobid => this.jobs.get(jobid))
            .filter(j => j != null && proxyCmds.indexOf(j.command) > -1)
            .forEach(job => {
                durSec = job.durationSec + durSec;
                progress = job.progress + progress;
            });

        return Math.round(progress * 100. / durSec);
    }
}
