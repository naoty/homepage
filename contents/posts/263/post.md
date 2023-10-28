---
title: 「すごいHaskell たのしく学ぼう！」を読んだ
time: 2015-06-14 18:40
tags: ['book', 'haskell']
---

[![すごいHaskellたのしく学ぼう！](http://ecx.images-amazon.com/images/I/51pYSdnkuNL._SL160_.jpg "すごいHaskellたのしく学ぼう！")](http://www.amazon.co.jp/exec/obidos/ASIN/B009RO80XY/naotoknk-22/)

[すごいHaskellたのしく学ぼう！](http://www.amazon.co.jp/exec/obidos/ASIN/B009RO80XY/naotoknk-22/)

- 作者: Miran Lipovaca
- 出版社/メーカー: オーム社
- 発売日: 2012/09/21
- メディア: Kindle版
- 購入: 4人 クリック: 9回
- [この商品を含むブログを見る](http://d.hatena.ne.jp/asin/B009RO80XY/naotoknk-22)

本書は一度は8章あたりで挫折したが、今回13章あたりまで読みファンクタ―、アプリカティブファンクタ―、モノイド、モナドといった概念がなんなのか理解とまでは言えないけど知ることができた。

一度は挫折したが今回またリベンジしようと思った理由は、今後モバイルアプリを開発していくにあたって関数型プログラミングの概念を理解して採り入れていくことが必要になってくると思ったからだ。Swiftは`let`による不変型の宣言や`Optional`型などの文脈付きの型など関数型プログラミング言語としての側面をもっていると思う。また、データバインディング（[SwiftBond/Bond](https://github.com/SwiftBond/Bond)など）やJSONのパース（[thoughtbot/Argo](https://github.com/thoughtbot/Argo)など）といった場面で関数型プログラミングの概念が登場してきている。Swiftのポテンシャルを最大限に発揮して、堅牢で生産性の高いコードを書くには関数型プログラミングの知識が必要になってきていると最近感じている。

本書を読んだ結果として、データの構造について新しい視点を得ることができた。`Maybe`や`Either`といった概念を"文脈"と呼んでいるのが自分の中にはなかった発想だった。例えば、`Maybe`と`Maybe Int`を区別して考えるのはとても抽象的だけど強力な考え方と思った。`Maybe`は「あるかもしれないし、ないかもしれない」という文脈を表し、`Maybe Int`は「`Int`型かもしれないし、何もないかもしれない」型を表している。これらを分けることで、文脈を保ったまま計算するという発想が出てくるのだと思う。文脈を保ったまま計算する段階として、本書では`Functor`や`Applicative`、そして`Monad`が登場してきた。

Swiftでは、Haskellにおける型コンストラクタにあたる概念がない。Genericsを使うことで`Maybe`のような型を表現することはできるが、ある型が型引数をとるのかとらないのか、とるとしたらいくつとるのかを知る術はない（はず）。Haskellではそれらは種類という概念で説明されている。`Maybe`の種類は`Maybe :: * -> *`だし、`Either`の種類は`Either: * -> * -> *`となっているので、それぞれ型引数を1つと2つとることがわかる。Haskellの`Functor`は種類が`* -> *`の型コンストラクタしかインスタンスにできないのだけど、こういう概念をSwiftで表現できない。

というわけで、Swiftで関数型プログラミングをするにはHaskellほどうまくはできないことがなんとなくわかった。Genericsなどで擬似的に表現するしかない。`Functor`の`fmap`を以下のように実装してみた。

```
extension Optional {
    func fmap<U>(f: T -> U) -> U? {
        switch self {
        case .Some(let value):
            return f(value)
        case .None:
            return .None
        }
    }
}

let maybeOne: Int? = 1
let maybeTen = maybeOne.fmap({ x in x * 10 })
```

Swiftの`Optional<T>`型はつまり`T?`型のことなのだけど、`Optional`型を拡張して`fmap`を追加している。`return f(value)`のところは暗黙的に`U?`型にラップしている。このように実装することで、`Optional`型のもつ「あるかもしれないし、ないかもしれない」という文脈を保ちつつ、中身の`1`という`Int`を計算している。

ここでは`Functor`だけを簡単に実装してみたが、これに加えて`Applicative`と`Monad`を実装するとより抽象的な計算が可能になってくる。JSONのパースなどを実装する際には`Applicative`の操作が必要になってきそうな感じがする。自分はまだ関数型プログラミングの実装を実際にしたわけではないので、理解したとは到底いえない。パーサーの実装をしてみたり、上で紹介したライブラリのコードを読んでみることで関数型プログラミングを実践的に理解していきたい。
