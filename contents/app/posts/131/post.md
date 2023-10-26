---
title: 見やすいgit-grep
time: 2012-07-02 15:30
tags: ['git']
---

```.zshrc
alias gg="git grep -H --heading --break"
```

```.gitconfig
[grep]
  lineNumber = true
```
![git-grep](http://gyazo.com/6896ca7dc18ae1ab53e05e6efa3602b9.png?1341209674)

- `-H`でファイル名を相対パスにする
- `--heading`でファイル名をヒットした行の上にまとめて表示する
- `--break`で空行を入れる
- `git config --global grep.lineNumber true`と打つと、デフォルトでヒットした行数を表示する

---
### 訂正
- `-H`はフルパスじゃなくて相対パスでした（manの英語がわかりにくい
