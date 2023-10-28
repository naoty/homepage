---
title: D3.jsで"+09:00"がパースできない件
time: 2014-07-24 14:34
tags: ['javascript']
---

```js
var dateString = "2014-07-23T00:00:00.000+09:00";

var wrongFormat = d3.time.format("%Y-%m-%dT%H:%M:%S.%L%Z");
wrongFormat.parse(dateString); //=> null

var rightFormat = d3.time.format("%Y-%m-%dT%H:%M:%S.%L+09:00");
rightFormat.parse(dateString); //=> Date
```

タイムゾーンを表す`%Z`は`+0900`のようなフォーマットはパースできるけど、`:`が含まれるとパースできない。上のようにしたら解決した。

### 参考
- https://github.com/mbostock/d3/wiki/Time-Formatting
- https://groups.google.com/forum/#!topic/d3-js/mPiCEO8ZfnU
