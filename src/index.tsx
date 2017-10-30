import * as React from "react";
import {AppBar} from "react-toolbox/lib/app_bar";
import {Navigation} from 'react-toolbox/lib/navigation';
import {ProgressBar} from 'react-toolbox/lib/progress_bar';
import {FontIcon} from 'react-toolbox/lib/font_icon';


import {Card, CardText} from 'react-toolbox/lib/card';

import {CompositeDisposable, Observable, Subject} from 'rx';
import * as Cloud from "vgcloudapi";
import * as ReactDOM from "react-dom";
import {ConStatus, DashBoardDataSource} from "./data";
import {Project} from 'bfapi';


class StatusIcon extends React.Component<ConStatus, {}> {

    render() {
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
    p: Project;
    masterProgress: number;
    scansProgress: any[];
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
                    <td><b>Project Name</b></td>
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


let MediaProgress = (progress: number) => {
    if (progress >= 100) {
        return (<div>
            <FontIcon value='done'/>
        </div>);
    } else {
        return (<div>
            {progress}%
            <ProgressBar mode='determinate' value={progress}/>
        </div>);
    }
};


let ScansProgress = (scans: any[]) => {
    let done = scans.filter(f => f["percent"] == 100);
    let progress = scans.length

    if (scans.length > 0 && done.length == scans.length) {
        // all done
        return (<div>{scans.length}</div>)
        // return (<div>{scans.length}<FontIcon value='done'/></div>);
    } else {
        return (<div>{done.length}/{scans.length}<br/>
            <ProgressBar mode='determinate' value={progress}/></div>)
    }
};

let PackageProgress = (scans: any[]) => {

}

class ProjectCard extends React.Component<ProjectCardProps, {}> {
    render() {
        if (this.props.masterProgress == -1) {
            return (<Card style={{width: '100%', margin: '0px', float: 'left'}}>
                <CardText style={ProjectHeader.colStyle}>
                    {this.props.p.name}<br/>
                    Loading...
                </CardText>
            </Card>)
        }

        return (<Card style={{width: '100%', margin: '0px', float: 'left'}}>
            <table>
                <tbody>
                <tr>
                    <td style={ProjectHeader.colStyle}>
                        {this.props.p.name}<br/>
                        {this.props.p.status.toString()}
                    </td>
                    <td style={ProjectHeader.colStyle}>
                        {MediaProgress(this.props.masterProgress)}
                    </td>
                    <td style={ProjectHeader.colStyle}>
                        {ScansProgress(this.props.scansProgress)}
                    </td>
                    <td style={ProjectHeader.doubleCell}>
                        {/*<div style={{float: "left", paddingRight: "5px"}}>Proxy: 3/16</div>*/}

                        <div style={{float: "left"}}>FDD: -1/123123</div>
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
            .throttle(420)
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
        console.log("render()", this.props.data);
        let list: any = [];
        list.push((<ProjectHeader/>));

        this.props.data.projects.forEach(p => {
            let scansProgress = p.scanIds.reduce((prev: any, sid) => {
                prev.push({"id": sid, "percent": this.props.data.proxyPackageProgress(sid)});
                return prev;
            }, []);

            let percentDone = this.props.data.proxyPackageProgress(p.masterId);

            // let fddProgress = this.props.data.fddProgress(p.)
            list.push(<ProjectCard key={p.id} masterProgress={percentDone} scansProgress={scansProgress} p={p}/>);
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


const dataSourceHost = "vdms.anton.videogorillas.com";
// const dataSourceHost = "kote.videogorillas.com:8042";
// const dataSourceHost = "localhost:8042";
// const dataSourceHost = "10.0.1.140:8142";
console.log("data source ", dataSourceHost);

let data = new DashBoardDataSource(dataSourceHost);
console.log("Booting...");
let ga = document.getElementById("app");
let p = new DashBoardProps();
p.data = data;
ReactDOM.render(React.createElement(BigFootDashboard, p), ga);
console.log("OK.");
