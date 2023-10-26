---
title: Railsでオートリンクを有効にしつつサニタイズ
time: 2014-03-07 18:21
tags: ['rails']
---

本文をサニタイズしつつ、オートリンクを有効化したいので以下のように設定した。オートリンクは`rails_autolink`というgemが必要。

```rb:application.rb
config.after_initialize do
  ActionView::Base.sanitized_allowed_tags.clear
  ActionView::Base.sanitized_allowed_tags = ["a"]
  ActionView::Base.sanitized_allowed_attributes = ["rel", "target"]
end
```

許可するtagをクリアしたあとにホワイトリスト方式で許可するタグを指定した。あと、デフォルトでは`rel="nofollow"`とか`target="_blank"`がサニタイズされてしまうので、許可したい属性を追加した。
