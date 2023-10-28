---
title: Dateクラスのタイムゾーンの不思議
time: 2011-07-20 12:02
tags: ['ruby']
---

```
$ date
2011年 7月20日 水曜日 00時46分27秒 JST
```

```
Date.current #=> Tue, 19 Jul 2011
Date.today #=> Wed, 20 Jul 2011
```

Date.currentはUTC、Date.todayはJSTを返すのだろうか？
