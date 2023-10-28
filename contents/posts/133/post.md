---
title: 見やすいgit-tag
time: 2012-07-10 20:44
tags: ['git']
---

```.zshrc
alias gt="git for-each-ref --sort=-taggerdate --format='%(taggerdate:short) %(tag) %(taggername) %(subject)' refs/tags"
```

![git-tag](http://gyazo.com/e6fd03bfaea9f3b44f9c60d8b539dd3c.png?1341920431)

- `git tag`でタグ名を一覧で表示できる。`git tag -n`でコメントもいっしょに表示できる。だけど、タグをつけた日付とかタグをつけた人も表示するには`git tag`では無理みたい。
- `git for-each-ref`はcommitとかtagとかのrefがバーっとみれる（まだよく理解してない）
- `--sort=`で表示されるソート順。`-taggerdate`でタグをつけた日付の降順。`-`をつけないと昇順。
- `--format=`で出力されるフォーマットを指定できる。細かいところはmanをみてください。けっこう細かいので説明するのが大変。。。
- `refs/tags`は表示する条件。これでタグだけを表示できる。
