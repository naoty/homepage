---
title: ドメイン・プリミティブ in Dart
time: 2023-01-20 22:25
tags: ['ddd', 'dart']
---

[セキュア・バイ・デザイン](https://book.mynavi.jp/ec/products/detail/id=124056)という本を最近読んでいて、その中で紹介されるドメイン・プリミティブという設計手法が印象に残ったのでDartでどのように実装できるか試してみた。

ドメイン・プリミティブとは、簡単に言うと、その値が常に有効であることが保証された値オブジェクトのことを指していて、`String`や`int`のような汎用的なデータ型に代わって使われる。

# 実装例
以下の例では税を含む金額の計算をDartを使ってモデリングしている。

まず、金額を表すために単なる`int`の代わりに`Money`というドメイン・プリミティブを定義する。-1000円といった負の値は有効ではないのでファクトリーコンストラクタで事前条件を検証し、デフォルトコンストラクタを非公開にすることで有効な値のみで初期化できるようにしている。

```dart
class Money {
  final int value;

  Money._internal(this.value);

  factory Money(int value) {
    if (value < 0) {
      throw ArgumentError.value(value, 'value', 'must be >= 0');
    }

    return Money._internal(value);
  }
}
```

次に、税を表す`Tax`というドメイン・プリミティブを定義する。ここでは通常税率と軽減税率の2種類を定義した。Dartのenhanced enumsを使い、定数コンストラクタを定義すれば、コンパイル時には値が決定するためコンストラクタの引数を検証する必要がない。

```dart
enum Tax {
  regular(rate: 0.1),
  reduced(rate: 0.08);

  final double rate;

  const Tax({required this.rate});
}
```

次に、税抜価格を`Money`型を利用して定義する。`Money`型を利用しているので、自動的に負の値になることは実行時に保証されている。

```dart
class TaxExcludedPrice {
  final Money money;

  TaxExcludedPrice(this.money);
}
```

最後に、これらを利用して税込価格を定義する。コンストラクタにて税抜価格と税から生成するようにしているため、任意の数値から税込価格を直接生成することができない。

```dart
class TaxIncludedPrice {
  final Money money;

  TaxIncludedPrice({
    required TaxExcludedPrice taxExcludedPrice,
    required Tax tax,
  }) : money = Money((taxExcludedPrice.money.value * (1 + tax.rate)).round());
}
```

これらを使って軽減税率の商品の税込価格を計算してみる（紙幅の関係で`toString()`の実装は省略してある）。

```dart
void main() {
  final taxExcludedPrice = TaxExcludedPrice(Money(1000));
  final taxIncludedPrice = TaxIncludedPrice(
    taxExcludedPrice: taxExcludedPrice,
    tax: Tax.reduced,
  );

  print('tax included price is $taxIncludedPrice.');
  //=> tax included price is 1080.
}
```

# 何が良いのか
こうした金額を実装する際、`int`や`double`といった基本データ型を直接使って表すことが多いが、`Money`型を導入することで「負の値は許容しない」といったドメインルールを内包することができる。

また、`TaxIncludedPrice`型が`TaxExcludedPrice`型と`Tax`型からでないと生成できないようにしていることで「税込価格は税抜価格に税を加えた値である」といったドメインロジックを型システムによって強制できるため、単体テストなどによる保証よりもさらにfail-fastな設計となり、より堅牢なコードになる。
