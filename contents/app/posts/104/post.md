---
title: Capistranoでassets:precompileを自動化
time: 2012-03-12 22:16
tags: ['rails']
---

```ruby:Capfile
load 'deploy'
# Uncomment if you are using Rails' assets pipeline
  # load 'deploy/assets'
```
このコメントアウトを外すだけ。外すと、

- `deploy:update_code`のあとに`deploy:assets:precompile`というタスクを実行し、precompileする
- public/assetsへのシンボリックリンクをshared/assetsに作る

なんでコメントアウトしたし…

## 追記
- 投稿したあとに同じような投稿を見つけてしまった。そちらではバグみたいなことを報告されてた。
- 一応、環境も追記しておきます。

```sh
% rails --version
Rails 3.2.2
% cap --version
Capistrano v2.11.2
```
