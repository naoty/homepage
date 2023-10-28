---
title: class_evalとinstance_eval
time: 2011-07-22 01:42
tags: ['ruby']
---

以下のようなクラスとインスタンスについて考えていく。

```
Person = Class.new # Personクラスの作成（Classクラスのインスタンスの作成）
naoty = Person.new # Personクラスのインスタンスの作成
```

今回はclass\_evalとinstance\_evalについて。どっちとも引数のブロック内の文字列をRubyコードとして評価して実行するのだが、実行するコンテキストが異なる。

```
Person.class_eval do
  def greet
    p 'Hello, my world!'
  end
end
naoty.greet #=> "Hello, my world!"
```

- class\_evalはレシーバ（＝Person）をクラスとしてブロック内を実行する。クラス内で実行されたのと同じ。
- この場合、Personをクラスとしてgreetを定義しているので、greetはインスタンスメソッドとなり、naotyというインスタンスから呼び出すことができる。
- privateメソッドを呼び出すときに使われることが多い。

```
Person.instance_eval do
  def greet
    p 'Hello, world!'
  end
end
Person.greet #=> "Hello, world!"
naoty.greet #=> NoMethodError: undefined method 'greet' for ...
```

- instance\_evalはレシーバ（＝Person）をインスタンスとしてブロック内を実行する。
- instance\_evalでメソッドを定義すると、そのインスタンスの特異メソッドが定義されることになる。
- PersonをClassクラスのインスタンスとして考えると、instance\_eval内で定義されたメソッドはPersonの特異メソッドであり、すなわちクラスメソッドということになる。
