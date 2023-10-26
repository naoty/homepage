---
title: Classクラスに関する仮説
time: 2011-07-11 23:44
tags: ['ruby']
---

```
Object.class #=> Class
Module.class #=> Class
Class.class #=> Class

Class.superclass #=> Module
```

irbで上記のような結果を得たので、これよりClassクラスってこんな感じじゃないかと思った。あくまで仮説だけどねー。

```
class Class < Module
  Object = self.new
  Module = self.new
  Class = self.new

  # ...
end
```

概念じゃよくわかんないので、ソースコードで考えてみた方がわかりやすい気がする。

- -

追記

```
Class.instance_methods(false)
#=> [:allocate, :new, :superclass]

Class.private_methods(false)
#=> [:inherited, :initialize, :initialize_copy]
```

という結果から、さっきの仮説を少し修正する必要があるっぽい。newはインスタンス・メソッドだということがわかったから。で、newの代わりにインスタンスを作ってるのが、プライベート・メソッドのinitializeっぽい。

```
class Class < Module
  Object = self.initialize
  Module = self.initialize
  Class = self.initialize

  # ...
end
```
