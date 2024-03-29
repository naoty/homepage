---
title: 変数の区別
time: 2010-09-26 17:36
tags: ['ruby']
---

ローカル変数

- 小文字または「\_」で始まる。
- 宣言された変数スコープのみアクセスできる。変数スコープとは、ファイル内、クラス定義、モジュール定義、メソッド定義、ブロック内のこと。例えば、以下のように入れ子になっても、3つのvarは異なる値を持つ。

```
var = 1 # ファイル内のvar
class Foo
  var = 2 # クラス定義内のvar
  def meth
    var = 3 # メソッド定義内のvar
  end
end
```

インスタンス変数

- 「@」で始まる。
- メソッド定義内で宣言された場合には、同じインスタンス内のみでアクセスできる。クラス定義内で宣言された場合には、同じクラスのクラスメソッドまたはインスタンスメソッドでアクセスできる。サブクラスからはアクセスできない。

クラス変数

- 「@@」で始まる。
- クラス内の全インスタンス、サブクラスの全インスタンスで共有される。

グローバル変数

- 「$」で始まる。
- どこからでもアクセスできる。

定数

- 大文字から始まる。
- 自分のクラスに定義されている定数がなければ、次の順序で探す。１．トップレベル以外のネストの外側の定数、２．スーパークラスの定数
- ネストの内側の定数を参照するには、「::」演算子を用いる。
- 再代入することは可能だが、警告が出る。
