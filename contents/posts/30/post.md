---
title: セレクタのリファクタリング
time: 2011-01-20 19:56
tags: ['jquery']
---

　セレクタがごちゃごちゃするとき、以下のように書き換えると処理速度が向上するそうです。なるべくセレクタはシンプルにまとめて、find()を利用するといいそうです。

Before

```
$("tr td").remove();
$("tr:first", this).remove();
```

After

```
$("tr").find("td").remove();
$(this).find("tr").first().remove();
```
