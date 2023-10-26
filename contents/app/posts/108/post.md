---
title: モバイルからのリクエストのCSRF検証をスキップする
time: 2012-03-29 00:15
tags: ['rails']
---

以前書いた内容が動かなかったので、再投稿。

```ruby:Gemfile
gem 'which_browser'
```

```ruby:application_controller.rb
class ApplicationController < ActionController::Base
  protect_from_forgery

  protected

  # Override
  def verified_request?
    request.mobile? || super
  end
end
```

- `protect_from_forgery`内ではCSRF検証を行うアクション`verify_authenticity_token`をfilterにはさんでる。
- そのアクションの中で実際にCSRF検証を行う条件として使われているメソッドが`verified_request?`。
- というわけで、こいつをオーバーライドしてあげればCSRF検証の条件を追加することができる。

---
### 追記

which_browserをフォークしてtitaniumのiOSシミュレータからのリクエストにも対応させた。

```ruby:Gemfile
gem 'which_browser', :git => 'git://github.com/naoty/which_browser.git', :branch => 'titanium_prototype'
```

```ruby:application_controller.rb
class ApplicationController < ActionController::Base
  protect_from_forgery

  protected

  # Override
  def verified_request?
    request.ti_iphone? || super
  end
end
```
