---
title: Timepieceを0.4.0にアップデートした
time: 2015-07-19 23:06
tags: ['oss']
---

[naoty/Timepiece](https://github.com/naoty/Timepiece)

Timepieceを`0.4.0`にアップデートした。ぶっちゃけブログの記事にするくらいならちゃんとCHANGELOGにしろという話なんだけど、技術的な詳細も少し話したいのでブログの記事にした。軽微なバグの修正と以下の2点が今回の変更点だ。

# タイムゾーンのサポート

これがメインの変更になる。「サーバー側から受け取る時間のタイムゾーンとiOSアプリケーションのタイムゾーンが異なっており、それらを比較したい」みたいなissueをもらったので対応した。「こういう感じのインターフェイスはどう？」みたいなのを聞いてたら「Sweet!」だのと褒められたので、その気になって実装してしまった。けっこう大変だった。

iOSでは、`NSDate`オブジェクトそのものにタイムゾーンは存在しない。システムで設定されるタイムゾーンを`NSCalendar`経由で取得することになる。

```
NSCalendar.currentCalendar().timeZone
```

なので、今回のようなケースだと、`NSDate`オブジェクトそれぞれにタイムゾーンが存在するように見せる必要がありそうだった。なお、オフセットを調整することも考えられるが、時間を足し引きしてしまった段階でそれは別の時間となってしまう。同じ時間で別のタイムゾーンを持つ`NSDate`オブジェクトが必要だった。実装方針としては、

- デフォルトでは`NSCalendar`経由でシステムのタイムゾーンを取得する
- タイムゾーンをセットする場合はそのタイムゾーンを持つ新しい`NSDate`を生成して返す（状態を更新しない）

ということを念頭に置いた。

ところで、Timepieceは`NSDate`を始めとするいくつかの既存のオブジェクトのextensionとして実装されている。extensionで`NSDate`オブジェクトに`timeZone`のようなプロパティを追加することは普通はできない。しかし、Objective-CのランタイムAPIを使って動的にプロパティを追加することで、これをなんとか実現させることができる。Swiftの場合でも、ランタイムAPIを使うことは可能だ。

```
import ObjectiveC

public extension NSDate {
    var timeZone {
        return objc_getAssociatedObject(self, &AssociatedKeys.TimeZone) as? NSTimeZone ?? calendar.timeZone
    }

    func change(#timeZone: NSTimeZone) -> NSDate! {
        // ...

        objc_setAssociatedObject(newDate, &AssociatedKeys.TimeZone, timeZone, UInt(OBJC_ASSOCIATION_RETAIN_NONATOMIC))

        // ...
    }
}
```

`objc_`から始まる関数がランタイムAPIだ。これらの関数によって動的にオブジェクトにプロパティを読み書きしている。`change(timeZone:)`で生成された`NSDate`オブジェクトのみ動的に追加されたプロパティを持つ。タイムゾーンが異なる`NSDate`同士の計算も問題なく行われている。これは上述の通りオフセットの調整による実装ではないためだと思う。

# playgroundの追加

機能というわけじゃないけど、リポジトリにplaygroundを追加した。それに伴ってプロジェクトからワークスペースに変更した。実際にTimepieceを試してもらうには、サンプルのアプリケーションを作ってPodfileを書いて…みたいなことをする必要がありとても面倒だったので、Timepieceが使えるplaygroundを用意した。

# Pull request大歓迎

タイムゾーン周りの実装は正直あんまり自信はないんだけど、テストはちゃんと通ってるしまぁいいかくらいの気持ちでリリースした。観点が漏れている可能性は大いにありうるので、ぜひPull requestしてもらいたい。
