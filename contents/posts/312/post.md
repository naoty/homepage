---
title: todoをtmuxで表示する
time: 2017-12-22T13:34:00+0900
description: naoty/todoを改良して次のtodoをtmuxのstatus lineに表示できるようにした
tags: ["oss"]
---

![次のtodoをtmuxのstatus lineに表示する](todo.gif)

[naoty/todo](https://github.com/naoty/todo)に改良して、上のスクリーンキャストのようにtmuxのstatus lineに次のtodoを表示できるようにしてみた。

`next`というコマンドを追加し、最も優先順位の高いtodoを表示できるようにした。また、`done`コマンドに引数を指定しない場合に`next`で表示されるtodoを完了できるようにした。`done`コマンドなどで次のtodoが変わっても、tmuxが自動的に更新してくれるのですぐに切り替わる。

iTerm2の画面分割を使っていたためtmuxは使ってこなかったが、status lineに次のtodoを表示するアイデアを思いついたため使い始めた。この使い方によって、次にやることを`list`コマンドで何度も確認する必要がなくなったし、次にやるべきことのみに集中できるため、とてもいい。

# 導入方法
まず、[naoty/todo](https://github.com/naoty/todo)をインストールする。

```bash
$ brew tap naoty/misc
$ brew install todo
```

次に.tmux.confを以下のように修正する。

```
set-option -g status-right-length 80
if-shell 'which todo' 'set-option -g status-right "next: #(todo next)"'
```
