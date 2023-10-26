---
title: 実行環境とBundler.require
time: 2011-11-02 00:24
tags: ['ruby']
---

Gemfile

```
source 'http://rubygems.org'

gem 'rails', '3.1.1'

group :assets do
  gem 'sass-rails', '~> 3.1.4'
  gem 'coffee-rails', '~> 3.1.1'
  gem 'uglifier', '>= 1.0.3'
end

gem 'jquery-rails'

group :development, :test do
  gem 'turn', :require => false
end

group :production do
  gem 'therubyracer'
end
```

以上のようなGemfileがあった場合、Bundler.requireによって次のような結果が得られる。

```
Bundler.require(:default)
#=> rails, jquery-rails
Bundler.require(:default, :assets)
#=> rails, jquery-rails, sass-rails, coffee-rails, uglifier
Bundler.require(:default, :assets, :development)
#=> rails, jquery-rails, sass-rails, coffee-rails, uglifier, turn

Bundler.require(*Rails.groups(:assets => %w(development test)))
#=> Bundler.require(:default, :development, :assets) # for Rails.env == 'development'
#=> rails, jquery-rails, sass-rails, coffee-rails, uglifier, turn

#=> Bundler.require(:default, :production) # for Rails.env == 'production'
#=> rails, jquery-rails, therubyracer
```

Bundler.requireの仕様を理解していれば、config/application.rbのコメントの説明も理解できるだろう。

config/application.rb

```
if defined?(Bundler)
  # If you precompile assets before deploying to production, use this line
  Bundler.require(*Rails.groups(:assets => %w(development test)))
  # If you want your assets lazily compiled in production use this line
  # Bundler.require(:default, :assets, Rails.env)
end
```

production環境でaseetsをどのタイミングでプリコンパイルするかで、この設定を変更する必要があるようだ。

```
Bundler.require(*Rails.groups(:assets => %w(development test)))
#=> production環境では:assetsはロードされないので、デプロイ前に手動でプリコンパイルしておく必要がある

Bundler.require(:default, :assets, Rails.env)
#=> production環境でも:assetsをロードするので、自動でプリコンパイルしてくれる
```
