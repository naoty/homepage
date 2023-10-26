---
title: 特異クラスと特異メソッド
time: 2011-07-20 23:16
tags: ['ruby']
---

以下の3つのコードはすべて同じことをしている。

```
naoty = Person.new('naoty') # naotyはPersonクラスのインスタンス
def naoty.greet # naotyというインスタンスに特異メソッドを定義
  p 'Hello, my world!'
end

class Person # PersonはClassクラスのインスタンス
  # ...
end
def Person.greet # PersonというClassクラスのインスタンスに特異メソッド（＝クラスメソッド）を定義
  p 'Hello, world!'
end
```

- あるインスタンスにのみ定義されたメソッドを「特異メソッド」と呼ぶ。
- すべてのクラスはClassクラスのインスタンスである。
- ゆえに、クラスメソッドはClassクラスのインスタンスに定義された「特異メソッド」である。

```
naoty = Person.new('naoty') # naotyはPersonクラスのインスタンス
class << naoty # naotyというインスタンスの特異クラスをオープン
  def greet # 特異クラス内で定義されたメソッドはもちろん特異メソッド
    p 'Hello, my world!'
  end
end

class Person # PersonはClassクラスのインスタンス
  # ...
end
class << Person # PersonというClassクラスのインスタンスの特異クラスをオープン
  def greet # 特異クラス内で定義されたメソッドはもちろん特異メソッド（＝クラスメソッド）
    p 'Hello, world!'
  end
end
```

- 「特異メソッド」はメソッドであるが、あるインスタンスのみに定義されている。
- すべてのメソッドはクラスに属する。
- 「特異メソッド」は「特異クラス」に属する。

```
class Person
  # ...

  class << self # PersonというClassクラスのインスタンスの特異クラスをオープン
    def greet # 特異クラス内で定義されたメソッドはもちろん特異メソッド（＝クラスメソッド）
      p 'Hello, world!'
    end
  end
end
```

- クラス定義内のselfはクラスそのものを指すので、上記のように書き換えられる。
- 「class \<\< self; end;」内で定義されたメソッドは、クラスメソッドとなる。
