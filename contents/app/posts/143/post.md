---
title: Regexp#+を定義して「または」を簡単に作る
time: 2012-09-06 18:22
tags: ['ruby']
---

「AまたはB」のような正規表現を簡単に作ろうと思って以下のようにしてみたら、うまくいかなかった。

```ruby
001 > /qiita/ + /kobito/
NoMethodError: undefined method `+' for /qiita/:Regexp
```

意外にも`Regexp#+`が定義されてなかったので、以下のようにクラスを拡張してみた。

```ruby
class Regexp
  def +(other)
    Regexp.new(self.source + '|' + other.source)
  end
end
```

`Regexp#source`はその正規表現の文字列を返すメソッド。で、期待通りにうまくいった。

```ruby
002 > /qiita/ + /kobito/
=> /qiita|kobito/
```
