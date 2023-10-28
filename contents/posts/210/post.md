---
title: 安全なrmコマンド
time: 2014-03-03 15:06
---

rmで大事なファイルを消さないようにゴミ箱フォルダに移動させる設定です。

```zsh
$ brew install trash
```

```zsh:.zshrc
alias rm="trash"
```
