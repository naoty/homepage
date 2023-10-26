---
title: Rails3にrspecとfactory girlをインストールしたときのメモ
time: 2011-07-18 22:07
tags: ['rails', 'rspec']
---

```
# /Gemfile
gem 'rspec-rails'
gem 'factory_girl_rails'
```

```
$ bundle install --path vendor/bundle
```

```
$ rails g rspec:install
Mon Jul 18 21:51:37 [initandlisten] connection accepted from 127.0.0.1:50773 #1
Mon Jul 18 21:51:37 [conn1] end connection 127.0.0.1:50773
Mon Jul 18 21:51:37 [initandlisten] connection accepted from 127.0.0.1:50774 #2
      create .rspec
      create spec
      create spec/spec_helper.rb
Mon Jul 18 21:51:37 [conn2] end connection 127.0.0.1:50774
```

作成済みのモデルのrspecファイルを生成する場合

```
$ rails g rspec:model user
Mon Jul 18 21:55:13 [initandlisten] connection accepted from 127.0.0.1:50866 #3
Mon Jul 18 21:55:13 [conn3] end connection 127.0.0.1:50866
Mon Jul 18 21:55:13 [initandlisten] connection accepted from 127.0.0.1:50867 #4
      create spec/models/user_spec.rb
Mon Jul 18 21:55:14 [conn4] end connection 127.0.0.1:50867
```

ファクトリーを定義するファイルを作成

```
$ touch spec/factories.rb
```

テスト実行

```
$ rake spec <file>
```
