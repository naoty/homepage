---
title: Moduleによるクラスの拡張
time: 2011-07-20 13:42
tags: ['ruby']
---

```
Module CoolModule
  # このModuleをインクルードしたクラスを引数にブロック内を実行
  def self.included(class)
    # 第1引数のメソッドを第2引数以降を引数に実行
    class.send :alias_method_chain, :hoge_method, :cool
  end

  # インクルードしたクラス内で定義（≠実行）
  def hoge_method_with_cool
    # ...
  end
end
```

　クラスがモジュールをインクルードすると、モジュールに定義されたメソッドをクラスでも使えるようになる（クラス内に定義される）。一方、インクルードされたときにメソッドを実行したい場合（alias\_method\_chain、define\_method、class\_eval等）、Module#includedを使う。
