---
title: Titaniumでdate.jsを使う
time: 2012-04-08 21:39
tags: ['titanium']
---

標準のDateライブラリが使いにくいので便利なdate.jsをTitaniumで使う。
date.jsをダウンロードしてResourcesディレクトリ以下に配置して以下のとおり。

```javascript:app.js
require('date');
```

```javascript
Date.today(); //=> 2012-04-07 15:00:00 +0000
Date.tomorrow(); //=> 2012-04-08 15:00:00 +0000
```
