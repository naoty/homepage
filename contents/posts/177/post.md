---
title: bundle execを使わずに済む方法（rbenv編）
time: 2013-04-07 17:59
tags: ['ruby']
---

```sh
$ cd
$ mkdir .rbenv/plugins
$ cd .rbenv/plugins
$ git clone git://github.com/ianheggie/rbenv-binstubs.git
```

- rbenvにはpluginsという仕組みがあってrbenvに機能を追加できる。ruby-buildもその一つ。「ひとつのことをうまくやる」思想っぽい。
- そのpluginのひとつにbundlerとの連携をうまくやってくれる[rbenv-bundler](https://github.com/carsomyr/rbenv-bundler)というのがあるんだけど、rbenvはこれを[非推奨](https://github.com/sstephenson/rbenv/wiki/Plugins#bundler-integration)といってる。パフォーマンスが悪くなったり、バグが多いみたい。
- 同じようなpluginを探したところ、[rbenv-binstubs](https://github.com/ianheggie/rbenv-binstubs)というものを見つけた。[thoughtbotのブログ](http://robots.thoughtbot.com/post/47273164981/using-rbenv-to-manage-rubies-and-gems)で紹介されていた。

### Rails 3

```sh
$ cd path/to/project
$ bundle install --binstubs
$ rbenv rehash
$ rails s
```

- `--path=vendor/bundle`を指定するとうまくいかなかった。

### Rails 4

```sh
$ cd path/to/project
$ bundle install --binstubs=bundle_bin
$ rbenv rehash
$ rails s
```

- Rails 4からはbinディレクトリの扱いが若干変わるので要注意。詳しくは[こちら](http://qiita.com/items/01c41578e611b038da6e)。
- binstubsが実行ファイルを生成するディレクトリを指定する。指定してもちゃんと動く。
