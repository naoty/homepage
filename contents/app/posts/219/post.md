---
title: PecoからRakeタスクを実行する
time: 2014-06-23 19:11
---

Rakeタスクを先頭から入力するのがダルいのでpecoを組み合わせてみた。

```zsh:.zshrc
pecorake() { local task=$(rake -W | peco | cut -d " " -f 2); rake $task }
```

Escでキャンセルしたときを考慮してないけど、これだけの設定でかなり捗るようになった。peco便利。
