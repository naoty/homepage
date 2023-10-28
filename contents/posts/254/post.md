---
title: Timepieceを0.2.0にアップデートした
time: 2015-03-01 15:06
tags: ['oss']
---

[naoty/Timepiece](https://github.com/naoty/Timepiece)

Swiftの日付操作ライブラリであるTimepieceに機能を追加し0.2.0にアップデートした。また、1ヶ月くらい前からしれっとCocoaPods（現在はまだrc版）をサポートしたのでCocoaPodsからインストールできるようになってる。

# NSDate \<-\> Stringの変換

```
let timestamp = 3.years.ago.stringFromFormat("yyyy-MM-dd")
XCTAssertEqual(timestamp, "2012-03-01", "")

if let birthday = "1987-06-02".dateFromFormat("yyyy-MM-dd") {
    XCTAssertEqual(birthday.year, 1987, "")
    XCTAssertEqual(birthday.month, 6, "")
    XCTAssertEqual(birthday.day, 2, "")
}
```

`NSDateFormatter`をいちいち初期化するのが面倒だったので、これを内部的に呼び出す直感的なメソッドを追加した。フォーマット文字列は同じ。

# オーバーロードの追加

Before: ![f:id:naoty_k:20150301145950p:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20150301/20150301145950.png "f:id:naoty\_k:20150301145950p:plain")

After: ![f:id:naoty_k:20150301150005p:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20150301/20150301150005.png "f:id:naoty\_k:20150301150005p:plain")

これまでは`NSDate.date(year:month:day:hour:minute:second:)`は`hour`, `minute`, `second`のデフォルト引数を`0`にセットしていたが、これではBeforeのスクショの通り補完候補に`hour`, `minute`, `second`も含まれてしまう。デフォルト引数を使うよりも引数を省略したオーバーロードを提供した方が、補完候補に省略版のメソッドが現れるため使いやすいと思う。

# 今後の予定

- `NSDate`同士を比較演算子で比較できるようにしたい。
- `1.5.hour`のような`Float`のサポート（けっこう難しそう）
