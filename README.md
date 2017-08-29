# Install

```
cd js/
make install
make js

```

# Dev hack-hack
```
cd js/
make watch

```

# BigFoot and Cloud2398 API clients

bigfoot api client

https://github.com/videogorillas/vg-brain/tree/api-client/bigfoot/jsapi

cloud api client

https://github.com/videogorillas/cloud2398/tree/04x-stable/jsapi

`vim package.json`

```json
{
  "dependencies": {
    "vgcloudapi": "file:/Users/zhukov/git/cloud2398/jsapi",
    "bfapi": "file:/Users/zhukov/git/vg-brain-master/bigfoot/jsapi"
  }
}
```