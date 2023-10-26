---
title: peco+giboで.gitignoreのテンプレを1秒で取得
time: 2014-09-30 10:50
---

```zsh:.zshrc
pecogibo() {
    gibo -l | peco | xargs gibo
}
```

![tty.gif](https://qiita-image-store.s3.amazonaws.com/0/1044/cdd66863-9ebd-a59c-f032-728e2ac5bfb1.gif)

[gibo](https://github.com/simonwhitaker/gibo)は [https://github.com/github/gitignore](https://github.com/github/gitignore) から.gitignoreのテンプレを取得するコマンドラインツールで、`brew install gibo`からインストールできる。
