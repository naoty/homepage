---
title: Rails 3のバッチ処理
time: 2011-06-10 11:39
tags: ['rails']
---

```
$ rails runner [ファイル名]
```

で実行します。ファイルは/script以下に配置します。

今回は、一日の（投稿数、新規ユーザーなどの）カウントをリセットするバッチ処理を書いてみました。

/script/reset\_count.rb

```
# encoding: utf-8
SomethingCool.all.each {|sc| sc.update_attributes({:cool_user_count => 0})}
```

あとは、このファイルをcronで一日一回実行すれば、毎日のカウントをリセットすることができますね。
