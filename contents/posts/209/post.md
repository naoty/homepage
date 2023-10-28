---
title: プラットフォーム依存のgemのせいでデプロイがこける件
time: 2014-02-05 19:13
tags: ['ruby']
---


```
You are trying to install in deployment mode after changing
your Gemfile. Run `bundle install` elsewhere and add the
updated Gemfile.lock to version control.

You have deleted from the Gemfile:
* growl
```

みたいなメッセージがでてきてデプロイ大失敗した。

原因はGemfileに`RUBY_PLATFORM`を使ったことだった。

```rb:Gemfile
group :test do
  gem "growl" if RUBY_PLATFORM =~ /darwin/
end
```

上のメッセージはGemfileとGemfile.lockに不整合があるときに表示される。このようなGemfileの書き方だと、デプロイ先で実行したとき、`gem "growl"`が存在しないことになりGemfile.lockとの不整合が生まれると考えられる。

そこで、Gemfileをこう書き替えた。

```rb:Gemfile
group :test do
  gem "growl", group: :darwin
end
```

で、capistranoにこのグループをインストールしないように設定する。

```rb:deploy.rb
# Ignore platform-specific gems
set :bundle_without, %w(development test darwin).join(" ")
```

