import * as React from "react";
import {AppBar} from "react-toolbox/lib/app_bar";
import {Navigation} from 'react-toolbox/lib/navigation';
import {ProgressBar} from 'react-toolbox/lib/progress_bar';

import {Card} from 'react-toolbox/lib/card';

import {CompositeDisposable, Observable, Subject} from 'rx';
import * as Cloud from "vgcloudapi";
import {Job, Media} from "vgcloudapi";
import * as ReactDOM from "react-dom";

import * as BigFoot from 'bfapi';


class StatusIcon extends React.Component<ConStatus, {}> {

    render() {
        console.log("statusicon", this.props.connstatus);
        if (this.props.connstatus == Cloud.ConnectionStatus.ONLINE) {
            return (
                <svg viewBox="0 0 100 100">
                    <circle style={{fill: "green"}} r="30" cx="50" cy="50"/>
                </svg>
            )
        }

        return (
            <svg viewBox="0 0 100 100">
                <circle style={{fill: "red"}} r="30" cx="50" cy="50"/>
            </svg>
        )

    }
}


class ProjectCardProps {
    p: BigFoot.Project;
    masterProgress: number;
}

class ProjectHeader extends React.Component<{}, {}> {
    public static colStyle = {
        display: "inline-block",
        minWidth: "106px",
        padding: "20px 16px 14px",
        alignItems: "center"
    } as React.CSSProperties;

    public static doubleCell = {
        minWidth: "212px",
        padding: "20px 16px 14px",
        alignItems: "center"
    } as React.CSSProperties;

    render() {
        return (<Card style={{width: '100%', margin: '0px', float: 'left'}}>
            <table>
                <tbody>
                <tr>
                    <td style={ProjectHeader.colStyle}><b>Project Name</b></td>
                    <td style={ProjectHeader.colStyle}><b>Master</b></td>
                    <td style={ProjectHeader.colStyle}><b>Scans</b></td>
                    <td style={ProjectHeader.doubleCell}><b>Bigfoot Package</b></td>
                    <td style={ProjectHeader.doubleCell}><b>Cloud Match</b></td>
                </tr>
                </tbody>
            </table>
        </Card>);
    }
}

class ProjectCard extends React.Component<ProjectCardProps, {}> {
    render() {
        let scanscount = this.props.p.scanIds.length;
        return (<Card style={{width: '100%', margin: '0px', float: 'left'}}>
            <table>
                <tbody>
                <tr>
                    <td style={ProjectHeader.colStyle}>
                        {this.props.p.name}<br/>
                        {this.props.p.status.toString()}
                    </td>
                    <td style={ProjectHeader.colStyle}>
                        {this.props.masterProgress}%
                        <ProgressBar mode='determinate' value={this.props.masterProgress}/>
                    </td>
                    <td style={ProjectHeader.colStyle}>
                        -1/{scanscount}<br/>
                        <ProgressBar mode='determinate' value={42}/>
                    </td>
                    <td style={ProjectHeader.doubleCell}>
                        <div style={{float: "left", paddingRight: "5px"}}>Proxy: 3/16</div>
                        <div style={{float: "left"}}>FDD: -1/{scanscount}</div>
                        <ProgressBar mode='determinate' value={6.25}/>
                    </td>
                    <td style={ProjectHeader.doubleCell}>
                        80% (2Hrs left)<br/>
                        <ProgressBar mode='determinate' value={80}/>
                    </td>
                </tr>
                </tbody>
            </table>
        </Card>);
    }
}

class DashBoardProps {
    data: DashBoardDataSource;
}

class DashBoardState {
    dataUpdated: Date = new Date();
}

class BigFootDashboard extends React.Component<DashBoardProps, DashBoardState> {
    private subs: CompositeDisposable;

    constructor(props: DashBoardProps) {
        super(props);
        this.state = new DashBoardState();
    }

    componentDidMount() {
        this.subs = new CompositeDisposable();

        let newDataNotification = this.props.data.projectRx().map(v => true)
            .merge(this.props.data.mediaRx().map(v => true))
            .merge(this.props.data.jobRx().map(v => true))
            .throttle(1000)
            .merge(this.props.data.statusRx().map(v => true));

        newDataNotification = newDataNotification.doOnError(e => {
            console.error("oops", e);
        });
        newDataNotification.subscribe(foo => {
            this.setState(prevState => {
                if (prevState == null) {
                    return;
                }
                prevState.dataUpdated = new Date();
            })
        });
    }

    render() {
        let list: any = [];
        if (this.props.data.isOffline() && this.props.data.projects.size == 0) {
            list.push((<div>Hi there. There are no projects. Go create one</div>));
        } else {
            list.push((<ProjectHeader/>));

            this.props.data.projects.forEach(p => {
                let master: Media = this.props.data.media.get(p.masterId);
                console.log("master=", master);
                let percentDone = 0;
                if (master) {
                    this.props.data.proxyPackageProgress(p.masterId);
                    percentDone = this.props.data.proxyPackageProgress(p.masterId);
                }

                list.push(<ProjectCard masterProgress={percentDone} key={p.id} p={p}/>);
                console.log("p=", p);
            });
        }


        return (
            <div>
                <AppBar title="Bigfoot Dashboard" rightIcon={<StatusIcon connstatus={this.props.data.status.connstatus}
                                                                         updated={this.props.data.status.updated}/>}>
                    <Navigation type="horizontal">
                        {/*<Link href="http://" label="Inbox" icon="inbox"/>*/}
                        {/*<Link href="http://" active label="Profile" icon="person"/>*/}
                    </Navigation>
                </AppBar>
                {list}
            </div>
        )
    }
}


class ConStatus {
    public connstatus: Cloud.ConnectionStatus;
    public updated: Date;

    constructor(s: Cloud.ConnectionStatus) {
        this.connstatus = s;
        this.updated = new Date();
    }
}


class DashBoardDataSource {
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

    constructor(liveUpdate: Cloud.LiveUpdate, cloud: Cloud.CloudServicesV2, bf: BigFoot.ApiClient) {
        this.liveUpdate = liveUpdate;
        this.cloud = cloud;
        this.bf = bf;
        this.subs = new CompositeDisposable();
        this.mediaUpdates = new Subject<Media>();
        this.subs.add(this.liveUpdate.getMediaRx()
            .subscribe(m => {
                this.media.set(m.id, m);
                this.mediaUpdates.onNext(m);
            }));


        this.jobUpdates = new Subject<Job>();
        this.subs.add(this.liveUpdate.getJobRx()
            .subscribe(j => {
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

    public proxyPackageProgress(masterId: string): number {
        let media = this.media.get(masterId);

        let proxyCmds = [Cloud.Job.THUMBS, Cloud.Job.THUMBSHQ, Cloud.Job.AACPASSTHRU, Cloud.Job.MAKEDASH,
            Cloud.Job.HIGH23, Cloud.Job.FDD, Cloud.Job.MAKEHLS, Cloud.Job.SEGMENTER];

        let jobs = Observable.from(media.getJobIds()).flatMap(jobid => {
            let j = this.jobs.get(jobid);

            if (j == null) {
                return this.cloud.loadJob(jobid);
            }
            return Observable.just(j);
        });


        let progress = 0;
        let durSec = -1;
        jobs.toArray().forEach(jobs => {
            jobs.forEach(jj => {
                if (proxyCmds.indexOf(jj.command) > -1) {
                    durSec = jj.durationSec + durSec;
                    progress = jj.progress + progress;
                }
            });
        });

        return Math.round(progress * 100. / durSec);
    }

}


const dataSourceHost = "kote.videogorillas.com:8042";

let liveUpdate = new Cloud.LiveUpdate("ws://" + dataSourceHost + "/ws/api");
let cloud = new Cloud.CloudServicesV2("http://" + dataSourceHost);
let bf = new BigFoot.ApiClient("http://" + dataSourceHost);

let data = new DashBoardDataSource(liveUpdate, cloud, bf);
console.log("Booting...");
let ga = document.getElementById("app");
let p = new DashBoardProps();
p.data = data;
ReactDOM.render(React.createElement(BigFootDashboard, p), ga);
console.log("OK.");

liveUpdate.connect();
