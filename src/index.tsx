import * as React from "react";
import {AppBar} from "react-toolbox/lib/app_bar";
import ProgressBar from 'react-toolbox/lib/progress_bar';

import {Card} from 'react-toolbox/lib/card';

import {Observable, Subject} from 'rx';
// import * as BigFoot from "bfapi"
// import {Project} from "bfapi";
import * as Cloud from "vgcloudapi";
import {Media} from "vgcloudapi";
import * as ReactDOM from "react-dom";


// BigFoot.ApiClient.getProjById("ololo").subscribe(p => {
//     console.log("project4244", p)
// });

// Cloud.CloudServices.loadMedia("m1").subscribe(m => {
//     console.log("media", m)
// });

//
// class PieProps {
//     value: number;
//     width: string = "32px";
//     height: string = "32px";
// }
//
// class PieState {
// }
//
// class Pie extends React.Component<PieProps, PieState> {
//
//     render() {
//         let onePercent = 189 / 100;
//         let number = this.props.value * onePercent;
//         let strokeDasharray = number + " 189";
//         let circStyle = {
//             fill: "yellowgreen",
//             stroke: "#655",
//             strokeWidth: "32",
//             strokeDasharray: strokeDasharray,
//             animation: "fillup 5s linear infinite"
//         } as React.CSSProperties;
//
//         let style = {
//             transform: "rotate(-90deg)",
//             background: "yellowgreen",
//             borderRadius: "50%",
//             width: this.props.width,
//             height: this.props.height
//         } as React.CSSProperties;
//
//         return (
//             <svg viewBox="0 0 100 100" style={style}>
//                 <circle style={circStyle} r="30" cx="50" cy="50"/>
//             </svg>
//         )
//     }
// }

interface MediaItem {
    progress: number
}


class MediaItemState {
}

class MediaItemProps {
    media: Media;
}

class MediaItem extends React.Component<MediaItemProps, {}> {

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

        return (<Card style={{width: '100%', margin: '0px', float: 'left'}}>
            <table>
                <tbody>
                <tr>
                    <td style={colStyle}>
                        {this.props.media.filename}<br/>
                    </td>
                    <td style={colStyle}>
                        Master<br/>
                        0/1
                        <ProgressBar mode='determinate' value={42}/>
                    </td>
                    <td style={colStyle}>
                        Scans<br/>
                        1/16<br/>
                        <ProgressBar mode='determinate' value={42}/>
                    </td>
                    <td style={colStyle2}>
                        Bigfoot Package<br/>
                        <div style={{float: "left", paddingRight: "5px"}}>Proxy: 3/16</div>
                        <div style={{float: "left"}}>FDD: 1/16</div>
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
    mediaRx: Rx.Observable<Media>;
}

class DashBoardState {
    media: Media[] = [];
}

class BigFootDashboard extends React.Component<DashBoardProps, DashBoardState> {

    constructor(props: DashBoardProps) {
        super(props);
        this.state = new DashBoardState();
    }

    componentDidMount() {
        this.props.mediaRx.subscribe(m => {
            console.log("m=", m);
            this.setState(prevState => {
                if (prevState != null) {
                    prevState.media.push(m);
                }
            });
        });
        // let subscribe = Rx.Observable.interval(420).subscribe(x => this.setState({progress: x}));
    }

    render() {
        let list = this.state.media.map((value, index, array) => {
            return (<MediaItem key={value.id} media={value}/>);
        });

        return (
            <div>
                <AppBar title="Bigfoot Dashboard"/>
                {list}
            </div>
        )
    }
}

let liveUpdate = new Cloud.LiveUpdate("ws://kote.videogorillas.com:8042/ws/api");


console.log("Booting...");
let ga = document.getElementById("app");
let p = new DashBoardProps();
p.mediaRx = liveUpdate.getMediaRx();
ReactDOM.render(React.createElement(BigFootDashboard, p), ga);
console.log("OK.");

liveUpdate.connect();
