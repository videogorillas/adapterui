"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const app_bar_1 = require("react-toolbox/lib/app_bar");
const progress_bar_1 = require("react-toolbox/lib/progress_bar");
const card_1 = require("react-toolbox/lib/card");
// import * as BigFoot from "bfapi"
// import {Project} from "bfapi";
const Cloud = require("vgcloudapi");
const ReactDOM = require("react-dom");
class MediaItemState {
}
class MediaItemProps {
}
class MediaItem extends React.Component {
    render() {
        let colStyle = {
            width: "106px",
            padding: "20px 16px 14px",
            alignItems: "center"
        };
        let colStyle2 = {
            width: "212px",
            padding: "20px 16px 14px",
            alignItems: "center"
        };
        return (React.createElement(card_1.Card, { style: { width: '100%', margin: '0px', float: 'left' } },
            React.createElement("table", null,
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", { style: colStyle },
                            this.props.media.filename,
                            React.createElement("br", null)),
                        React.createElement("td", { style: colStyle },
                            "Master",
                            React.createElement("br", null),
                            "0/1",
                            React.createElement(progress_bar_1.default, { mode: 'determinate', value: 42 })),
                        React.createElement("td", { style: colStyle },
                            "Scans",
                            React.createElement("br", null),
                            "1/16",
                            React.createElement("br", null),
                            React.createElement(progress_bar_1.default, { mode: 'determinate', value: 42 })),
                        React.createElement("td", { style: colStyle2 },
                            "Bigfoot Package",
                            React.createElement("br", null),
                            React.createElement("div", { style: { float: "left", paddingRight: "5px" } }, "Proxy: 3/16"),
                            React.createElement("div", { style: { float: "left" } }, "FDD: 1/16"),
                            React.createElement(progress_bar_1.default, { mode: 'determinate', value: 6.25 })),
                        React.createElement("td", { style: colStyle2 },
                            "Cloud Match",
                            React.createElement("br", null),
                            "80% (2Hrs left)",
                            React.createElement("br", null),
                            React.createElement(progress_bar_1.default, { mode: 'determinate', value: 80 })))))));
    }
}
class DashBoardProps {
}
class DashBoardState {
    constructor() {
        this.media = [];
    }
}
class BigFootDashboard extends React.Component {
    constructor(props) {
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
            return (React.createElement(MediaItem, { key: value.id, media: value }));
        });
        return (React.createElement("div", null,
            React.createElement(app_bar_1.AppBar, { title: "Bigfoot Dashboard" }),
            list));
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
//# sourceMappingURL=index.js.map