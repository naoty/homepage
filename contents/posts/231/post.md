---
title: SwiftでNSDateを簡単に扱うライブラリを書いた
time: 2014-08-17 16:39
tags: ['oss']
---

Swiftの実験的なプロジェクトとしてActiveSupportの拡張っぽく直感的に時間を扱うライブラリ"Timepiece"というものを書いた。

[naoty/Timepiece · GitHub](https://github.com/naoty/Timepiece)

# demo

```
let today = NSDate.today()
let tomorrow = NSDate.tomorrow()
let dayAfterTomorrow = tomorrow + 1.day
let dayBeforeYesterday = 2.days.ago
let birthday = NSDate.date(year: 1987, month: 6, day: 2)
```

# 機能

- `1.day.ago`（1日前）、`4.years.later`（4年後）というように`Int`型を拡張し、`数.単位.前/後`という書き方で`NSDate`オブジェクトを初期化できる。単位は単数形、複数形どちらも使える。
- `NSDate() + 1.minute`（1分後）、`NSDate() - 3.hours`（3時間前）というように、`NSDate`オブジェクトから`数.単位`を加算・減算できる。
- `NSDate.date(year:month:day:hour:minute:second)`, `NSDate.today()`, `NSDate.yesterday()`, `NSDate.tomorrow()`というように、`NSDate`オブジェクトをより直感的に初期化できる。

# 今後

- 既存の`NSDate`オブジェクトの時間だけ変更したいとか、その日の0:00を取得したいという場合に対応したい。ActiveSupportとかmoment.jsの`beginning_of_day`, `endOf("day")`のようなやつ。
- 範囲オブジェクトのようなものを生成できるようにしたい。例えば、今日から1週間分の`NSDate`オブジェクトの範囲オブジェクトを作って繰り返し処理させられたら便利そう。

# 悩み

こういうライブラリでよくあるのがパース処理とフォーマット処理なんだけど、このライブラリでサポートすべきかどうか悩む。というのも、この手の処理は`NSDateFormatter`オブジェクトを使うと思うのだけど、便利なAPIのせいで無意識にムダな`NSDateFormatter`オブジェクトを何度も生成してしまう可能性がありそうだなと懸念している。

# プルリクチャンス

- こういう機能がほしいという希望があれば[issues](https://github.com/naoty/Timepiece/issues)でどんどん要望を伝えてほしいです。
- もちろん[Pull request](https://github.com/naoty/Timepiece/pulls)も歓迎です。コード量は多くないので、ちょっと読めば何をしているか思います。テストはちゃんと書いてます。
