---
title: bundle execを使わずにすむ方法
time: 2012-03-05 16:50
tags: ['rails']
---

rbenvの場合は[こちら](http://qiita.com/items/9000280b3c3a0e74a618)

## 前置き
- プロジェクトで使うライブラリはできるだけbundlerで管理したい。
- でも、いちいち`bundle exec rails s`とかやるのめんどい。
- `alias be="bundle exec"`として`be rails s`ってやるのもめんどくさくなってきた。
- なんかいい方法ないの？ってことで調べたら、すぐ見つかったのでご紹介。

## まとめ
1. rvmのフックスクリプトに実行権限を与える
2. `--binstubs`をつけて`bundle install`

## 具体例

```sh
$ cd
$ chmod +x .rvm/hooks/after_cd_bundler
$ cd workspaces/sampleapp
$ vi Gemfile
```

```ruby:Gemfile
source "http://rubygems.org"
gem "heroku"
```

```sh
$ bundle install --path vendor/bundle --binstubs
$ ls
Gemfile Gemfile.lock bin vendor
$ cd
$ cd workspaces/sampleapp
$ heroku --version
heroku-gem/2.20.0
```
## 解説
- `.rvm/hooks/after_cd_bundle`は`.bundle`ディレクトリが存在するプロジェクトに`cd`で移動したとき実行されるスクリプトで、`--binstubs`オプションで生成された`bin`ディレクトリにパスを渡す。
- `--binstubs`オプションは`bundle install`でインストールされたライブラリの実行スクリプトを`bin`ディレクトリのなかに生成する。

## 参考
- http://beginrescueend.com/integration/bundler/
