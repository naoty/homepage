---
title: ハッピーになれるpry拡張詰め合わせGemfile
time: 2012-03-20 18:05
tags: ['rails']
---

この[記事](http://blog.kiftwi.net/2012/03/20/summary-of-pry-plugins/)に感動したので、gemfileにまとめてみました。各gemの使い方はこの記事を参照してください。

```ruby:Gemfile
source 'http://rubygems.org'

group :development do
  gem 'pry-rails'
  gem 'pry-debugger'
  gem 'pry-exception_explorer'
  gem 'hirb-unicode'
end
```

```ruby:.pryrc
# https://github.com/pry/pry/wiki/FAQ#wiki-hirb
require 'hirb'

Hirb.enable

old_print = Pry.config.print
Pry.config.print = proc do |output, value|
  Hirb::View.view_or_page_output(value) || old_print.call(output, value)
end
```

---
### 追記：2012/3/20

- `pry-coolline`は日本語を入力すると表示が崩れてしまうのでいったん外しました
