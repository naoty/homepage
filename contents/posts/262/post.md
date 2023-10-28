---
title: naoty/todoとnaoty/nowisで定期的なtodoを管理できるようにした
time: 2015-05-30 19:32
tags: ['oss']
---

[前回](http://naoty.hatenablog.com/entry/2015/05/23/171705)のエントリで紹介した[naoty/todo](https://github.com/naoty/todo)と今回作ったnaoty/nowisを組み合わせることで、定期的なtodoをコマンドラインで管理できるようにした。

[naoty/nowis](https://github.com/naoty/nowis)

# 使い方

```
$ nowis saturday && echo 'Today is Saturday!'
Today is Saturday!
```

`nowis`コマンドは、現在時刻が引数で与えた曜日かどうかを判定して真なら終了コード`0`を返し偽なら`1`を返す。上のように`&&`で任意のコマンドと組み合わせることで、特定の曜日だけ実行できるようになる。

# 定期的なtodoの管理

`nowis`を組み合わせて定期的なtodoを管理するにはいくつか方法が考えられるが、zshの設定ファイルを使う。

```
# .zlogin

nowis sunday && todo add --once 部屋を掃除する
(nowis tuesday || nowis thursday) && todo add --once 燃えるゴミを出す
```

上のように設定することでzshにログインするたびに上のスクリプトが実行される。`todo add --once`で既に存在する場合は追加しないようにできるので、これで特定の曜日になると自動的に`todo add`されるようになる。

15分くらいで作ったので現状は曜日の判定しかできないけど、応用範囲が広そうなのでもうちょっと細かく判定できるようにするかも。
