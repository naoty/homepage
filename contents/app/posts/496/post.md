---
title: スマートコンストラクタ in Dart
time: 2022-11-14 21:45
tags: ['dart']
---

最近読んでいた"[Domain Modeling Made Functional](https://pragprog.com/titles/swdddf/domain-modeling-made-functional/)"という本のなかで、スマートコンストラクタと呼ばれるテクニックが紹介されていてとても面白く明日から使えるなと思ったので、最近書いているDartでどのように実装できるか調べてみた。

# スマートコンストラクタとは
スマートコンストラクタというのは、すべてのコンストラクタをprivateにし、代わりに有効な値ならインスタンスを返し無効な値ならエラーを返すようなコンストラクタのみを提供するような実装パターンのことを指す。

このような実装により、このクラスのインスタンスは必ず有効な値であることが保証される。そのため、あるオブジェクトをあちこちで検証する必要がなくなり、検証のための実装がスマートコンストラクタに集約されるため、凝集性の高いコードになる。また、検証漏れによる不具合も回避できるため、堅牢なコードになるとも言えるだろう。

# 実装例
JANコードを例にとる。JANコードは13桁または8桁の数字で構成され、`"jancode"`のような文字列はJANコードではない。こういったビジネスルールをスマートコンストラクタを使って実装してみる。

```dart
class Jancode {
  final String numbers;

  Jancode._internal(this.numbers);

  factory Jancode.fromNumbers(String numbers) {
    if (numbers.length != 13 || numbers.length != 8) {
      throw Exception('invalid JAN code');
    }

    // TODO: implement validation rules

    return Jancode._internal(numbers);
  }
}
```

```dart
void main() {
  final jancode = Jancode.fromNumbers('12345678');
}
```

- Dartでは`_`から始まるメソッドやフィールドはprivateとして扱われる。ここではコンストラクタを`_internal`のように定義することでprivateにしている。
- Dartでは必ずしも新しいインスタンスを返すわけではないコンストラクタを実装する際には`factory`キーワードを使う。不正な値を受け取ったら例外をthrowするために`factory`を使ったファクトリコンストラクタとして定義している。
- 「JANコードは13桁または8桁である」といったビジネスルールを`fromNumbers`に実装することで、正しいJANコードのみが`Jancode`のインスタンスとして生成できるようになった。
