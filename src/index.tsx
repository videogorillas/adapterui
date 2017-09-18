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
import {Project} from 'bfapi';

const GithubIcon = () => (
    <svg viewBox="0 0 284 277">
        <g>
            <path
                d="M141.888675,0.0234927555 C63.5359948,0.0234927555 0,63.5477395 0,141.912168 C0,204.6023 40.6554239,257.788232 97.0321356,276.549924 C104.12328,277.86336 106.726656,273.471926 106.726656,269.724287 C106.726656,266.340838 106.595077,255.16371 106.533987,243.307542 C67.0604204,251.890693 58.7310279,226.56652 58.7310279,226.56652 C52.2766299,210.166193 42.9768456,205.805304 42.9768456,205.805304 C30.1032937,196.998939 43.9472374,197.17986 43.9472374,197.17986 C58.1953153,198.180797 65.6976425,211.801527 65.6976425,211.801527 C78.35268,233.493192 98.8906827,227.222064 106.987463,223.596605 C108.260955,214.426049 111.938106,208.166669 115.995895,204.623447 C84.4804813,201.035582 51.3508808,188.869264 51.3508808,134.501475 C51.3508808,119.01045 56.8936274,106.353063 65.9701981,96.4165325 C64.4969882,92.842765 59.6403297,78.411417 67.3447241,58.8673023 C67.3447241,58.8673023 79.2596322,55.0538738 106.374213,73.4114319 C117.692318,70.2676443 129.83044,68.6910512 141.888675,68.63701 C153.94691,68.6910512 166.09443,70.2676443 177.433682,73.4114319 C204.515368,55.0538738 216.413829,58.8673023 216.413829,58.8673023 C224.13702,78.411417 219.278012,92.842765 217.804802,96.4165325 C226.902519,106.353063 232.407672,119.01045 232.407672,134.501475 C232.407672,188.998493 199.214632,200.997988 167.619331,204.510665 C172.708602,208.913848 177.243363,217.54869 177.243363,230.786433 C177.243363,249.771339 177.078889,265.050898 177.078889,269.724287 C177.078889,273.500121 179.632923,277.92445 186.825101,276.531127 C243.171268,257.748288 283.775,204.581154 283.775,141.912168 C283.775,63.5477395 220.248404,0.0234927555 141.888675,0.0234927555"/>
        </g>
    </svg>
);

class StatusIcon extends React.Component<ConStatus, {}> {

    render() {
        console.log(this.props.connstatus, this.props.connstatus == Cloud.ConnectionStatus.ONLINE);
        if (this.props.connstatus == Cloud.ConnectionStatus.ONLINE) {
            return (
                <svg viewBox="0 0 100 100">
                    <circle style={{fill: "green"}} r="30" cx="50" cy="50"/>
                </svg>
            )
        } else if (this.props.connstatus == Cloud.ConnectionStatus.CONNECTING) {
            return (
                <svg viewBox="0 0 100 100">
                    <circle style={{fill: "yellow"}} r="30" cx="50" cy="50"/>
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
    p: Project;
}

class ProjectCard extends React.Component<ProjectCardProps, {}> {

    render() {
        let colStyle = {
            width: "106px",
            padding: "20px 16px 14px",
            alignItems: "center"
        } as React.CSSProperties;

        let colStyle2 = {
            width: "212px",
            padding: "20px 16px 14px",
            alignItems: "center"
        } as React.CSSProperties;

        let scanscount = this.props.p.scanIds.length;
        return (<Card style={{width: '100%', margin: '0px', float: 'left'}}>
            <table>
                <tbody>
                <tr>
                    <td style={colStyle}>
                        {this.props.p.name}<br/>
                        {this.props.p.status.toString()}
                    </td>
                    <td style={colStyle}>
                        Master<br/>
                        0/1
                        <ProgressBar mode='determinate' value={42}/>
                    </td>
                    <td style={colStyle}>
                        Scans<br/>
                        -1/{scanscount}<br/>
                        <ProgressBar mode='determinate' value={42}/>
                    </td>
                    <td style={colStyle2}>
                        Bigfoot Package<br/>
                        <div style={{float: "left", paddingRight: "5px"}}>Proxy: 3/16</div>
                        <div style={{float: "left"}}>FDD: -1/{scanscount}</div>
                        <ProgressBar mode='determinate' value={6.25}/>
                    </td>
                    <td style={colStyle2}>
                        Cloud Match<br/>
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
        this.props.data.projects.forEach(p => {
            let master: Media = this.props.data.media.get(p.masterId);

            list.push(<ProjectCard key={p.id} p={p}/>);
            console.log("p=", p);
        });
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
    private bf: BigFoot.ApiClient;
    private subs: CompositeDisposable;

    private mediaUpdates: Subject<Media>;
    private projectUpdates: Subject<Project>;
    private jobUpdates: Subject<Job>;
    private statusUpdates: Subject<Cloud.ConnectionStatus>;

    public jobs: Map<string, Job> = new Map();
    public media: Map<string, Media> = new Map();
    public projects: Map<string, Project> = new Map();

    public status: ConStatus = new ConStatus(Cloud.ConnectionStatus.OFFLINE);

    constructor(liveUpdate: Cloud.LiveUpdate, bf: BigFoot.ApiClient) {
        this.liveUpdate = liveUpdate;
        this.bf = bf;
        this.subs = new CompositeDisposable();

        this.mediaUpdates = new Subject<Media>();
        this.subs.add(this.liveUpdate.getMediaRx().subscribe(m => {
            this.media.set(m.id, m);
            this.mediaUpdates.onNext(m);
        }));


        this.jobUpdates = new Subject<Job>();
        this.subs.add(this.liveUpdate.getJobRx().subscribe(j => {
            this.jobs.set(j.id, j);
            this.jobUpdates.onNext(j)
        }));


        this.projectUpdates = new Subject<Project>();
        let projectsO: Observable<Project> = Observable.just(1).merge(Observable.interval(15000))
            .concatMap(bf.listProjectIds())
            .concatMap(list => {
                return Observable.from(list);
            })
            .concatMap(pId => {
                return bf.getProjById(pId);
            });
        this.subs.add(projectsO.subscribe(p => {
            this.projects.set(p.id, p);
            this.projectUpdates.onNext(p);
        }));

        this.statusUpdates = new Subject<Cloud.ConnectionStatus>();
        this.subs.add(this.liveUpdate.getStatusRx().subscribe(cn => {
            // sta = OFFLINE, CONNECTING, ONLINE
            this.status = new ConStatus(cn);
            this.statusUpdates.onNext(cn);
        }));
    }

    public mediaRx(): Observable<Media> {
        return this.mediaUpdates;
    }

    public projectRx(): Observable<Project> {
        return this.projectUpdates;
    }

    public jobRx(): Observable<Job> {
        return this.jobUpdates;
    }

    public statusRx(): Observable<Cloud.ConnectionStatus> {
        return this.statusUpdates;
    }
}


let liveUpdate = new Cloud.LiveUpdate("ws://kote.videogorillas.com:8042/ws/api");
let bf = new BigFoot.ApiClient("http://kote.videogorillas.com:8042");

let data = new DashBoardDataSource(liveUpdate, bf);
console.log("Booting...");
let ga = document.getElementById("app");
let p = new DashBoardProps();
p.data = data;
ReactDOM.render(React.createElement(BigFootDashboard, p), ga);
console.log("OK.");

liveUpdate.connect();
