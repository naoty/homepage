---
title: IEでよくあるバグ
time: 2011-01-27 17:37
tags: ['javascript']
---

　オブジェクトでプロパティの最後に「,」をつけると、FFではよくてもIEでバグる。細かいから気づきにくい。

Bad

```
var options = {
  label: '合計',
  data: access_data,
}:
```

Good

```
var options = {
  label: '合計',
  data: access_data
}:
```
