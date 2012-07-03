#jQuery-Stone

cookie, localstorageを併用する

* Storage engine(localstorage, sessionStorage等)を組み込み拡張できるようにする
* 既存のライブラリだと、データの保存がfallbackのものが多いので、有効にしたstorage engineすべてに保存できるようにする

##Scripts

Uncompressed

    dist/jquery-stone.js

Minify

    dist/jquery-stone.min.js

--------

##Options
* engine mode
    * "none": onmemory only(force onmemory)
    * "cookie": cookie
    * "localstorage": localstorage
    * "sessionstorage"
    * "document" jQuery[$(document).data()]
* enableEngines[default]
   1. localstorage
   2. cookie
* saveMode: fallback[default], all
* onmemory: true/false(storage cache)[default: true]

```Javascript
// Initialize.
var store = $.stone({
  enableEngines: ['localstorage', 'cookie'],
  saveMode: fallback,
  onMemory: true
});

var storeOnMemory = $.stone({
    enableEngines: false,
    onMemory: true
});

var $cookie = $.stone({
    enableEngines: ['cookie']
});

// Interface.
store.get('key', {refresh: true});
store.set('key', {'foo': 'bar'}, {force: 'cookie'});
store.flush();
store.remove('key');
```

Flow
    App -> mem -> localstorage -> cookie -> mem -> App

get: priority(onmemory -> localstorage -> cookie -> onmemory)
set: fallback OR all(localstorage/cookie -> onmemory)
