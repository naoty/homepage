---
title: SwiftでNSDateを直感的に扱う
time: 2014-08-20 17:16
tags: ['oss']
---

[Timepiece](https://github.com/naoty/Timepiece)というライブラリを使うとNSDateを直感的に扱うことができる。

```swift
import Timepiece

// 3時間前
var date = 3.hours.ago

// 4年後
date = 4.years.later

// 今日（0:00）
date = NSDate.today()

// 明日（0:00）
date = NSDate.tomorrow()

// 昨日（0:00）
date = NSDate.yesterday()

// 足し算・引き算
date = NSDate() + 1.month
date = NSDate() - 5.minutes

// 正月
date = NSDate().beginningOfYear

// 特定の日時
date = NSDate.date(year: 2014, month: 8, day: 15, hour: 15, minute: 1, second: 43)
date = date.change(month: 2, day: 10)
```

以上、自分で作ったライブラリの宣伝でした。issueやPull requestお待ちしてます。
