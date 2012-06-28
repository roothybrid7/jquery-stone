#jQuery-Stone

cookie, localstorageを併用する

* Storage engine(localstorage, sessionStorage等)を組み込み拡張できるようにする
* 既存のライブラリだと、データの保存がfallbackのものが多いので、有効にしたstorage engineすべてに保存できるようにする


##Options
* engine mode
	* "none": onmemory only(force onmemory)
	* "cookie": cookie
	* "localstorage": localstorage
* enableEngines
   ["localstorage", "cookie"](default)
* saveMode: fallback, all
* onmemory: true/false(storage cache)[default: true]

```Javascript
$.stone({
  enableEngines: ["localstorage", "cookie"],
  saveMode: fallback,
  onMemory: true
});

// Interface.
$.stone.get('key', {refresh: true});
$.stone.set('key', {'foo': 'bar'}, {force: 'cookie'});
$.stone.flush();
$.stone.remove('key');
```

Flow
    App -> mem -> localstorage -> cookie -> mem -> App

get: priority(onmemory -> localstorage -> cookie -> onmemory)
set: fallback OR all(localstorage/cookie -> onmemory)
