---
title: naoty/require
time: 2023-04-22 23:29
tags: ['oss']
---

[naoty/require](https://github.com/naoty/require)というDartのパッケージを書いてみた。これは、不変条件を宣言的に記述するための小さなパッケージで、以下のように使う。

```dart
class User {
  final String name;
  final int? age;

  User({required this.name, this.age}) {
    require(name, label: 'name')
      .isNotEmpty()
      .hasLengthLessThanOrEqualTo(100)
      .matches(r'^[a-z]+$');
    requireIfNotNull(age, label: 'age')
      ?.isGreaterThanOrEqualTo(0);
  }
}
```

できるだけ自然言語として理解できるようにAPIを工夫した。これらの不変条件に違反すると、以下のようなエラーメッセージを持つ例外がthrowされる。

```
name('Naoto Kaneko') is required to match '^[a-z]+$'
```

# きっかけ
[セキュア・バイ・デザイン](https://book.mynavi.jp/ec/products/detail/id=124056)という本を読み、完全性を備えたドメインモデルを構築するためのテクニックとして不変条件が紹介されており、仕事で使っているDartでもこれを実装してみたいと思った。

ただ、言語仕様に備わっている`assert`では開発時のみにしか機能せず、こなれたAPIを持ったパッケージも見当たらなかったため、自分で実装してみようと思った。

# 工夫点
当初はDartプログラマーには馴染みが深い`test`パッケージのAPIデザインを踏襲しようとしてみたけど、後継の`checks`パッケージのことを思い出し、こちらを参考にしてみたところ、

- 複数の条件をメソッドチェーンとして表現できる
- nullableなオブジェクトを扱いやすい

といった特徴があることがわかり、自然言語らしい表現力と強い型システムを両立するデザインになった。例えば、nullableな値に対して`require`を呼ぶと`Subject<T?>`が返るのだけど、`Subject<T?>`に対しては`isNull`か`isNotNull`くらいしか呼べないようになっている。そして、`isNotNull`を呼ぶと`Subject<T>`が返るため、`isNotEmpty`など各種条件を呼び出せるようになる。

一方で、否定形の条件を記述することが難しいという限界もあり、乗り越える方法も考えてみた（`require().to(beEmpty())`のようなRSpec風のAPIデザインでは`require().notTo()`とすることで否定形を表現できる）が、逆にnullableなオブジェクトを扱いにくいことがわかったため、否定形ではなくnullablilityの扱いやすさに寄せる意思決定が必要になった。
