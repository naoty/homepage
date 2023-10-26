---
title: Swiftでストリームを扱うライブラリを書いた
time: 2014-08-31 00:01
tags: ['oss']
---

FRPの記事をいくつか見てあまり理解できなかったので、Swiftでストリームを扱うライブラリを書いてみた。結論から言うと、まだストリームについて深く理解できていない感じがするので「FRPとは何か」「ストリームとは何か」といった話はしない。そういう話は他のエントリーを読んでほしいと思う。

[naoty/Stream · GitHub](https://github.com/naoty/Stream)

# demo

```
let stream = Stream<String>()
let counterStream: Stream<Int> = stream.map({ message in
    return countElements(message)
}).scan(0, { previousMessage, message in
    return previousMessage + message
}).subscribe({ message in
    println(message)
})
stream.publish("Hello, ") //=> 7
stream.publish("wor") //=> 10
stream.publish("ld!") //=> 13
```

# 機能

- ストリームに`subscribe`で関数を渡すと、`publish`されたときにその関数が`publish`の引数が渡されて実行される。`subscribe`は失敗時と完了時に実行する関数を指定することもできる。ストリームに失敗を通知するのは`publish`の代わりに`fail`、完了を通知するのは`complete`。
- その他FRPのライブラリで実装されている次のような基本的なストリーム操作を実装した: `map`, `filter`, `scan`, `flatMap`, `throttle`, `debounce`, `buffer`, `merge`

# 結果

- ストリームという概念については理解できたけど、FRPという世界観の一部を理解しただけのような気がする。
- ライブラリ書いてみたけどSwiftのクロージャの循環参照らへんの実装があやしい。おかしなところがあれば指摘してもらえると助かります。
- iOS開発においてFRPをどのように適用できるか、まだ具体的なシーンがあまり思い浮かばない。けど、ストリームというのは概念をモデル化する際の見方の一つだと思うので、そういう見方があるということを理解した上で少しずつ既存のものの見方を変えてみるとわかってくるのかもしれないと思う。
