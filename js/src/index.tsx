import * as React from "react";
import {AppBar} from "react-toolbox/lib/app_bar";
import {Input} from "react-toolbox/lib/input";
import {Button} from "react-toolbox/lib/button";
import {Table} from "react-toolbox/lib/table";
import ProgressBar from 'react-toolbox/lib/progress_bar';

import {Card, CardActions, CardMedia, CardText, CardTitle} from 'react-toolbox/lib/card';

import * as ReactDOM from "react-dom";

import * as Rx from "rx"

import * as BigFoot from "bfapi"
import * as Cloud from "vgcloudapi"
import {Project} from "bfapi";
import {Media} from "vgcloudapi";

BigFoot.ApiClient.getProjById("ololo").subscribe(p => {
    console.log("project4244", p)
});

Cloud.CloudServices.loadMedia("m1").subscribe(m => {
    console.log("media", m)
});


class MediaItemState {
}

class MediaItemProps {
    key: string;
    media: Media;
}

class InfoCell extends React.Component<MediaItemProps, MediaItemState> {
    render() {
        return (
            <Card style={{width: '106px', margin: '0px', float: 'left'}}>
                <CardTitle title="85966e91-53f0-4710-b4a3-a4a7e17d15fd/video.mp4" subtitle="Added 2 mins ago">
                </CardTitle>

                <ProgressBar mode='determinate' value={42}/>
            </Card>
        )
    }
}


class PieProps {
    value: number;
    width: string = "32px";
    height: string = "32px";
}

class PieState {
}

class Pie extends React.Component<PieProps, PieState> {

    render() {
        let onePercent = 189 / 100;
        let number = this.props.value * onePercent;
        let strokeDasharray = number + " 189";
        let circStyle = {
            fill: "yellowgreen",
            stroke: "#655",
            strokeWidth: "32",
            strokeDasharray: strokeDasharray,
            animation: "fillup 5s linear infinite"
        } as React.CSSProperties;

        let style = {
            transform: "rotate(-90deg)",
            background: "yellowgreen",
            borderRadius: "50%",
            width: this.props.width,
            height: this.props.height
        } as React.CSSProperties;

        return (
            <svg viewBox="0 0 100 100" style={style}>
                <circle style={circStyle} r="30" cx="50" cy="50"/>
            </svg>
        )
    }
}

interface BFDState {
    progress: number
}

class BigFootDashboard extends React.Component<{}, BFDState> {

    constructor(props:{}) {
        super(props);
        this.state = {
            progress: 6.25
        }
    }

    componentDidMount() {
        let subscribe = Rx.Observable.interval(420).subscribe(x => this.setState({progress: x}));
    }

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

        return (
            <div>
                <AppBar title="Bigfoot Dashboard"/>
                <Card style={{width: '100%', margin: '0px', float: 'left'}}>
                    <table>
                        <tbody>
                        <tr>
                            <td style={colStyle}>
                                Scrubs2<br/>
                                EP24
                            </td>
                            <td style={colStyle}>
                                Master<br/>
                                0/1
                                <ProgressBar mode='determinate' value={42}/>
                            </td>
                            <td style={colStyle}>
                                Scans<br/>
                                1/16<br/>
                                <ProgressBar mode='determinate' value={this.state.progress}/>
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
                </Card>

            </div>
        )
    }
}


const project = {
    "created": "2017-08-01T04:13:56.108Z",
    "id": "whX8rcRuWSY",
    "masterId": "m1",
    // "matches": [],
    "name": "Charmed_Ep_20_Love_Hurts_2398_ENG_20_rev1",
    "notSeenByOperator": true,
    "owner": "user@videogorillas.com",
    "processingStarted": "2017-08-03T01:52:45.880Z",
    "scanIds": [
        "m2",
        "m3",
        "m10",
        "m9",
        "m11",
        "m12"
    ],
    "status": "NEW"
};

const media = {
    "_audio": [
        {
            "avg_frame_rate": "0/0",
            "bit_rate": 93464,
            "bits_per_sample": 0,
            "channel_layout": "stereo",
            "channels": 2,
            "codec_long_name": "AAC (Advanced Audio Coding)",
            "codec_name": "aac",
            "codec_tag": "0x6134706d",
            "codec_tag_string": "mp4a",
            "codec_time_base": "1/48000",
            "codec_type": "audio",
            "disposition": {
                "attached_pic": 0,
                "clean_effects": 0,
                "comment": 0,
                "default": 1,
                "dub": 0,
                "forced": 0,
                "hearing_impaired": 0,
                "karaoke": 0,
                "lyrics": 0,
                "original": 0,
                "timed_thumbnails": 0,
                "visual_impaired": 0
            },
            "duration": 2583.289042,
            "duration_ts": 123997874,
            "index": 1,
            "nb_frames": 121093,
            "profile": "LC",
            "r_frame_rate": "0/0",
            "sample_fmt": "fltp",
            "sample_rate": 48000,
            "start_pts": 0,
            "start_time": 0,
            "tags": {
                "handler_name": "Telestream Inc. Telestream Media Framework - Release TXGP 2016.42.192059",
                "language": "eng"
            },
            "time_base": "1/48000"
        }
    ],
    "_jobsById": {},
    "_rev": 5,
    "boxId": 0,
    "cachedUrl": "https://dl.boxcloud.com/d/1/ur3Cv6oIy3GBd58yOTybfO_3WiM4tHVHz7EVrjcZ9r6ptzGd7S-cBsKVrPNvXgQPNQX3luimBUKB5-fi9s4ODDYi1T133DkRYUrGGehncVIwieCw_ihQr_9bS9itbjeUW8bs1z4sZcc5z92Q4lXM6VpGVOw2X_RrIsIdhUfNAspa-znX78kRuPWuS7TOJvzRcgcK__mQImKVDk0iH1qBPQ2aUHbdquSQmGY3w_l0JkAb9crOIWOByJTchr5gu4PnQuEZPuZMVGFjwXeLnbH9HfIndaibj8jhTsRLH573JlRLrNjr4dXTVWBdtfohO-MUO-NbWlt5nh2k7v2P2UHZHq2ZlEgLnbjVwGQJ7UxIZ0108leBtsswa9_weI7P7ooBd8U1cotQv8KDo5BHo_gdG5ISyhAtZdiUIw2TrJGVmqMFfOH4jKEIBI4nOeHuyVumGZhTR8pzXDIxOSnnTlrFPpwHGCES2nzerEkkgK8CKrjj6Cn6UUrJJQf0bxgCKV7K8Fv3IQJD--4q9Zqi9kuCKDup_Cif_GPMj44ApOaBBJHnGOFxn931XRxEwVIZ8OQJRBxqqCrWozF_QVkR5tr2X2k-jtDYZ5No11fc-7uDLHXpdstZohi_IkhjSCdy3QPX1HR4JeuLsmsipM54zJFS4RsLoK2fQ8Sghun48S-JfrlsEDbCuqaTHxyQo-bqIeT1X9mwQM8-JmK06f5I2Xi1dF0Yr0y5UFy5eCUZ8nivCzm7Iw15wrPV0RoGnfv7c3p-VpSitk-0Ak6M1djUm1q2w9XnD1OR7e7kaa9HkV236IBWDTt703kXDv1akBL8XOmKvgOrk2lzcPj9t0DQCS2gaydZ-xCtu5g4Xv7parW3AiJq-EpXoJRYUmYewhszCM9P5mTvdr2p03oK0EnnH_117hQWH82R-Bv12Dl_-d3Sr8RIhzOGSF5yFnZvz3OkOkG22CEGzypDslnSD8U1wshDCgp-I4BwzwccBgibsv1i0EBrQ6DfmzUv9eJldtyT4_FCNnhKQ1-JaOoHVTXz2qkqBKZM_bx1yJhs3uK4yD0hBOu6y0YDsfert9J3p-0IrtWNRx7QDPTJGWkSKtREolLW_A../download",
    "commandParams": {
        "makedash": {
            "image": {
                "imageFile": "vglogo.png",
                "position": {
                    "horizontal": {
                        "align": "left",
                        "margin": "8%"
                    },
                    "vertical": {
                        "align": "bottom",
                        "margin": "12%"
                    }
                }
            }
        },
        "makehls": {
            "image": {
                "imageFile": "vglogo.png",
                "position": {
                    "horizontal": {
                        "align": "left",
                        "margin": "8%"
                    },
                    "vertical": {
                        "align": "bottom",
                        "margin": "12%"
                    }
                }
            }
        },
        "makehls1": {
            "image": {
                "imageFile": "vglogo.png",
                "position": {
                    "horizontal": {
                        "align": "left",
                        "margin": "8%"
                    },
                    "vertical": {
                        "align": "bottom",
                        "margin": "12%"
                    }
                }
            }
        },
        "vgproxy": {
            "image": {
                "imageFile": "vglogo.png",
                "position": {
                    "horizontal": {
                        "align": "left",
                        "margin": "8%"
                    },
                    "vertical": {
                        "align": "bottom",
                        "margin": "12%"
                    }
                }
            }
        }
    },
    "commands": [
        "nocache",
        "makedash",
        "makehls1",
        "vgproxy"
    ],
    "durationSec": 2583.289042,
    "ffprobe": {
        "format": {
            "bit_rate": 1005518,
            "duration": 2583.289042,
            "filename": "https://dl.boxcloud.com/d/1/ur3Cv6oIy3GBd58yOTybfO_3WiM4tHVHz7EVrjcZ9r6ptzGd7S-cBsKVrPNvXgQPNQX3luimBUKB5-fi9s4ODDYi1T133DkRYUrGGehncVIwieCw_ihQr_9bS9itbjeUW8bs1z4sZcc5z92Q4lXM6VpGVOw2X_RrIsIdhUfNAspa-znX78kRuPWuS7TOJvzRcgcK__mQImKVDk0iH1qBPQ2aUHbdquSQmGY3w_l0JkAb9crOIWOByJTchr5gu4PnQuEZPuZMVGFjwXeLnbH9HfIndaibj8jhTsRLH573JlRLrNjr4dXTVWBdtfohO-MUO-NbWlt5nh2k7v2P2UHZHq2ZlEgLnbjVwGQJ7UxIZ0108leBtsswa9_weI7P7ooBd8U1cotQv8KDo5BHo_gdG5ISyhAtZdiUIw2TrJGVmqMFfOH4jKEIBI4nOeHuyVumGZhTR8pzXDIxOSnnTlrFPpwHGCES2nzerEkkgK8CKrjj6Cn6UUrJJQf0bxgCKV7K8Fv3IQJD--4q9Zqi9kuCKDup_Cif_GPMj44ApOaBBJHnGOFxn931XRxEwVIZ8OQJRBxqqCrWozF_QVkR5tr2X2k-jtDYZ5No11fc-7uDLHXpdstZohi_IkhjSCdy3QPX1HR4JeuLsmsipM54zJFS4RsLoK2fQ8Sghun48S-JfrlsEDbCuqaTHxyQo-bqIeT1X9mwQM8-JmK06f5I2Xi1dF0Yr0y5UFy5eCUZ8nivCzm7Iw15wrPV0RoGnfv7c3p-VpSitk-0Ak6M1djUm1q2w9XnD1OR7e7kaa9HkV236IBWDTt703kXDv1akBL8XOmKvgOrk2lzcPj9t0DQCS2gaydZ-xCtu5g4Xv7parW3AiJq-EpXoJRYUmYewhszCM9P5mTvdr2p03oK0EnnH_117hQWH82R-Bv12Dl_-d3Sr8RIhzOGSF5yFnZvz3OkOkG22CEGzypDslnSD8U1wshDCgp-I4BwzwccBgi",
            "format_long_name": "QuickTime / MOV",
            "format_name": "mov,mp4,m4a,3gp,3g2,mj2",
            "nb_programs": 0,
            "nb_streams": 2,
            "probe_score": 100,
            "size": 324693201,
            "start_time": 0,
            "tags": {
                "compatible_brands": "mp42isom",
                "creation_time": "2016-08-29T11:10:20.000000Z",
                "major_brand": "mp42",
                "minor_version": "0"
            }
        },
        "streams": [
            {
                "avg_frame_rate": "24000/1001",
                "bit_rate": 903749,
                "bits_per_raw_sample": 8,
                "chroma_location": "left",
                "codec_long_name": "H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10",
                "codec_name": "h264",
                "codec_tag": "0x31637661",
                "codec_tag_string": "avc1",
                "codec_time_base": "1001/48000",
                "codec_type": "video",
                "coded_height": 360,
                "coded_width": 640,
                "display_aspect_ratio": "16:9",
                "disposition": {
                    "attached_pic": 0,
                    "clean_effects": 0,
                    "comment": 0,
                    "default": 1,
                    "dub": 0,
                    "forced": 0,
                    "hearing_impaired": 0,
                    "karaoke": 0,
                    "lyrics": 0,
                    "original": 0,
                    "timed_thumbnails": 0,
                    "visual_impaired": 0
                },
                "duration": 2583.289042,
                "duration_ts": 61998937,
                "has_b_frames": 1,
                "height": 360,
                "index": 0,
                "is_avc": "true",
                "level": 30,
                "nal_length_size": 4,
                "nb_frames": 61937,
                "pix_fmt": "yuv420p",
                "profile": "Main",
                "r_frame_rate": "24000/1001",
                "refs": 1,
                "sample_aspect_ratio": "1:1",
                "start_pts": 0,
                "start_time": 0,
                "tags": {
                    "encoder": "AVC",
                    "handler_name": "Telestream Inc. Telestream Media Framework - Release TXGP 2016.42.192059",
                    "language": "und"
                },
                "time_base": "1/24000",
                "width": 640
            },
            {
                "avg_frame_rate": "0/0",
                "bit_rate": 93464,
                "bits_per_sample": 0,
                "channel_layout": "stereo",
                "channels": 2,
                "codec_long_name": "AAC (Advanced Audio Coding)",
                "codec_name": "aac",
                "codec_tag": "0x6134706d",
                "codec_tag_string": "mp4a",
                "codec_time_base": "1/48000",
                "codec_type": "audio",
                "disposition": {
                    "attached_pic": 0,
                    "clean_effects": 0,
                    "comment": 0,
                    "default": 1,
                    "dub": 0,
                    "forced": 0,
                    "hearing_impaired": 0,
                    "karaoke": 0,
                    "lyrics": 0,
                    "original": 0,
                    "timed_thumbnails": 0,
                    "visual_impaired": 0
                },
                "duration": 2583.289042,
                "duration_ts": 123997874,
                "index": 1,
                "nb_frames": 121093,
                "profile": "LC",
                "r_frame_rate": "0/0",
                "sample_fmt": "fltp",
                "sample_rate": 48000,
                "start_pts": 0,
                "start_time": 0,
                "tags": {
                    "handler_name": "Telestream Inc. Telestream Media Framework - Release TXGP 2016.42.192059",
                    "language": "eng"
                },
                "time_base": "1/48000"
            }
        ]
    },
    "fileType": false,
    "filename": "QUANTICO_107_GO_10050418_Archimedes (1).mp4",
    "hasThumbnail": true,
    "humanReadableFilename": "QUANTICO_107_GO_10050418_Archimedes (1).mp4",
    "id": "m62",
    "isBuried": false,
    "jobIds": {
        "v332": "makedash",
        "v333": "high23",
        "v334": "thumbshq",
        "v335": "thumbs",
        "v336": "aacpassthru",
        "v337": "makehls1",
        "v338": "vgproxy",
        "v339": "iframes24",
        "v340": "vgaudio",
        "v341": "segmenter"
    },
    "type": "Media",
    "url": "https://dl.boxcloud.com/d/1/ur3Cv6oIy3GBd58yOTybfO_3WiM4tHVHz7EVrjcZ9r6ptzGd7S-cBsKVrPNvXgQPNQX3luimBUKB5-fi9s4ODDYi1T133DkRYUrGGehncVIwieCw_ihQr_9bS9itbjeUW8bs1z4sZcc5z92Q4lXM6VpGVOw2X_RrIsIdhUfNAspa-znX78kRuPWuS7TOJvzRcgcK__mQImKVDk0iH1qBPQ2aUHbdquSQmGY3w_l0JkAb9crOIWOByJTchr5gu4PnQuEZPuZMVGFjwXeLnbH9HfIndaibj8jhTsRLH573JlRLrNjr4dXTVWBdtfohO-MUO-NbWlt5nh2k7v2P2UHZHq2ZlEgLnbjVwGQJ7UxIZ0108leBtsswa9_weI7P7ooBd8U1cotQv8KDo5BHo_gdG5ISyhAtZdiUIw2TrJGVmqMFfOH4jKEIBI4nOeHuyVumGZhTR8pzXDIxOSnnTlrFPpwHGCES2nzerEkkgK8CKrjj6Cn6UUrJJQf0bxgCKV7K8Fv3IQJD--4q9Zqi9kuCKDup_Cif_GPMj44ApOaBBJHnGOFxn931XRxEwVIZ8OQJRBxqqCrWozF_QVkR5tr2X2k-jtDYZ5No11fc-7uDLHXpdstZohi_IkhjSCdy3QPX1HR4JeuLsmsipM54zJFS4RsLoK2fQ8Sghun48S-JfrlsEDbCuqaTHxyQo-bqIeT1X9mwQM8-JmK06f5I2Xi1dF0Yr0y5UFy5eCUZ8nivCzm7Iw15wrPV0RoGnfv7c3p-VpSitk-0Ak6M1djUm1q2w9XnD1OR7e7kaa9HkV236IBWDTt703kXDv1akBL8XOmKvgOrk2lzcPj9t0DQCS2gaydZ-xCtu5g4Xv7parW3AiJq-EpXoJRYUmYewhszCM9P5mTvdr2p03oK0EnnH_117hQWH82R-Bv12Dl_-d3Sr8RIhzOGSF5yFnZvz3OkOkG22CEGzypDslnSD8U1wshDCgp-I4BwzwccBgibsv1i0EBrQ6DfmzUv9eJldtyT4_FCNnhKQ1-JaOoHVTXz2qkqBKZM_bx1yJhs3uK4yD0hBOu6y0YDsfert9J3p-0IrtWNRx7QDPTJGWkSKtREolLW_A../download"
};

const m1 = {
    id: "m1",
    title: "85966e91-53f0-4710-b4a3-a4a7e17d15fd",
    image: "https://placeimg.com/800/450/nature"
};


console.log("Booting...");
let ga = document.getElementById("app");
ReactDOM.render(React.createElement(BigFootDashboard, {}), ga);
console.log("OK.");