---
title: Rails3でMongoidを使ってみる
time: 2011-05-10 00:09
tags: ['rails']
---

0.　環境

- Windows Vista
- Ruby 1.8.7
- Rails 3.0.7
- MongoDB 1.8.1
- bundler 1.0.13

1.　新規アプリケーションの作成

```
rails new sample -O
```

- 「-O」（大文字のオー、これで2回やりなおした(´・ω・｀)）をつけると、config/database.ymlが生成されません。今回はmongoidを使うので、このオプションを使います。
- オプションをつけないと、sqlite3でconfig/database.ymlが作られます。
- 「-d mysql」でmysqlでconfig/database.ymlが作られます。mysqlのところを他のDBに変えれば、柔軟に変更できます。

参考

> はじめる！Rails3（1）[http://tatsu-zine.com/books/rails3](http://tatsu-zine.com/books/rails3)

2.　bundlerでmongoidのインストール

- Gemfileを編集します。

```
# Bundle the extra gems:
# gem 'bj'
# gem 'nokogiri'
# gem 'sqlite3-ruby', :require => 'sqlite3'
# gem 'aws-s3', :require => 'aws/s3'
gem 'mongoid', '~> 2.0'
gem 'bson_ext', '~> 1.3'
```

- bundlerからmongoidとbson\_ext（パフォーマンスを上げるらしい）をvendor/bundleにインストールします。

```
bundle install vendor/bundle
```

ここでエラー発生。

```
$ bundle install vendor/bundle 
Fetching source index for http://rubygems.org/
Using activesupport (3.0.7)
Using builder (2.1.2)
Using i18n (0.5.0)
Using activemodel (3.0.7)
Using bson (1.3.0)
Installing bson_ext (1.3.0) c:/Ruby187/lib/ruby/site_ruby/1.8/rubygems/defaults/
operating_system.rb:9: The 'bson_ext' native gem requires installed build tools.
 (Gem::InstallError)

Please update your PATH to include build tools or download the DevKit
from 'http://rubyinstaller.org/downloads' and follow the instructions
at 'http://github.com/oneclick/rubyinstaller/wiki/Development-Kit'
        from c:/Ruby187/lib/ruby/site_ruby/1.8/rubygems/installer.rb:141:in `call'
        from c:/Ruby187/lib/ruby/site_ruby/1.8/rubygems/installer.rb:141:in `install'
        from c:/Ruby187/lib/ruby/site_ruby/1.8/rubygems/installer.rb:140:in `each'
        from c:/Ruby187/lib/ruby/site_ruby/1.8/rubygems/installer.rb:140:in `install'
        from c:/Ruby187/lib/ruby/gems/1.8/gems/bundler-1.0.13/lib/bundler/source.rb:100:in `install'
        from c:/Ruby187/lib/ruby/gems/1.8/gems/bundler-1.0.13/lib/bundler/installer.rb:58:in `run'
        from c:/Ruby187/lib/ruby/gems/1.8/gems/bundler-1.0.13/lib/bundler/rubygems_integration.rb:90:in `with_build_args'
        from c:/Ruby187/lib/ruby/gems/1.8/gems/bundler-1.0.13/lib/bundler/installer.rb:57:in `run'
        from c:/Ruby187/lib/ruby/gems/1.8/gems/bundler-1.0.13/lib/bundler/spec_set.rb:12:in `each'
        from c:/Ruby187/lib/ruby/gems/1.8/gems/bundler-1.0.13/lib/bundler/spec_set.rb:12:in `each'
        from c:/Ruby187/lib/ruby/gems/1.8/gems/bundler-1.0.13/lib/bundler/installer.rb:49:in `run'
        from c:/Ruby187/lib/ruby/gems/1.8/gems/bundler-1.0.13/lib/bundler/installer.rb:8:in `install'
        from c:/Ruby187/lib/ruby/gems/1.8/gems/bundler-1.0.13/lib/bundler/cli.rb:222:in `install'
        from c:/Ruby187/lib/ruby/gems/1.8/gems/bundler-1.0.13/lib/bundler/vendor/thor/task.rb:22:in `send'
        from c:/Ruby187/lib/ruby/gems/1.8/gems/bundler-1.0.13/lib/bundler/vendor/thor/task.rb:22:in `run'
        from c:/Ruby187/lib/ruby/gems/1.8/gems/bundler-1.0.13/lib/bundler/vendor/thor/invocation.rb:118:in `invoke_task'
        from c:/Ruby187/lib/ruby/gems/1.8/gems/bundler-1.0.13/lib/bundler/vendor/thor.rb:246:in `dispatch'
        from c:/Ruby187/lib/ruby/gems/1.8/gems/bundler-1.0.13/lib/bundler/vendor/thor/base.rb:389:in `start'
        from c:/Ruby187/lib/ruby/gems/1.8/gems/bundler-1.0.13/bin/bundle:13
        from c:/Ruby187/bin/bundle:19:in `load'
        from c:/Ruby187/bin/bundle:19
```

ここで詰まった＼(^o^)／

参考

> Mongoid: Installation [http://mongoid.org/docs/installation.html](http://mongoid.org/docs/installation.html)
