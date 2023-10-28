---
title: gemのディレクトリに一瞬で移動する
time: 2012-05-23 12:02
tags: ['ruby']
---

`bundle show [gem]`で指定したgemの絶対パスを取得できる。ので、以下のようにすれば、一瞬でgemのホームディレクトリに移動できる。

```
$ bundle show rails
/Users/naoty/workspace/sampleapp/vendor/bundle/ruby/1.9.1/gems/rails-3.1.0
$ cd `bundle show rails`
```

ちなみに、`bundle open [gem]`で指定したgemのディレクトリをエディタで開ける。こっちの方が使うかもしれない。事前に環境変数`EDITOR`を設定しておく必要がある。

```
$ echo $EDITOR
/usr/bin/vi
$ bundle open rails
```
