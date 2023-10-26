---
title: vimで右にhelpを表示する
time: 2012-08-14 15:58
tags: ['vim']
---

便利な設定があるわけじゃなさそうなので、こんなコマンドを自分で定義してみた。

![command](http://gyazo.com/d96e474ae19d51408d908c7ddc569171.png?1344926946)

```vim:.vimrc
commands! -nargs=1 -complete=help Vh :vertical belowright help <args>
```
- `commands!`でコマンドを指定。同名のコマンドがあれば上書きする。
- `-nargs=`で引数の数を指定
- `-complete=`で補完のタイプを指定。他にもファイルとかディレクトリとかあるらしい。
- `vertical belowright [cmd]`で縦分割して右ウィンドウにコマンドの結果を表示する。
- `<args>`は引数
