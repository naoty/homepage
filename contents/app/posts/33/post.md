---
title: プラグイン読み込みの設定
time: 2011-02-09 18:06
tags: ['rails']
---

　includeだけではプラグインを読み込めないことが発覚した。

```
module hogehoge
  # ...
end
```

```
class FugafugaController < ApplicationController
  include hogehoge #=> "uninitialized constant ..."というエラー
end
```

environment.rbに以下のように記述することが必要らしい。

```
Rails::Initializer.run do |config|
  config.plugins = [:hogehoge]
end
```

environment.rbは盲点だった...。

environment.rbのあれこれについては以下のエントリーが参考になりました。

> [毎日読むRails environment.rb その２](http://www.func09.com/wordpress/archives/189)
