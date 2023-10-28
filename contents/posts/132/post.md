---
title: Railsでよく使うDSLのfiletypeを設定する
time: 2012-07-03 08:48
tags: ['vim']
---

GemfileとかDSLで書かれた設定ファイルがrubyのファイルとして認識されずシンタックスハイライトやインデントが効いてないときがある。そういうときの設定。

```.vimrc
autocmd BufNewFile,BufRead Gemfile setlocal filetype=ruby
```

- `Gemfile`のあとにfiletypeを設定したいファイル名やパターンを追加すればおｋ。
- `autocmd`は「あるイベント」に対して「あるパターンのファイル」に「あるコマンド」を実行させる設定
- `BufNewFile`は新しいファイルを編集するイベント
- `BufRead`はファイルを読み込んで新しいバッファを開くイベント
- `filetype`の変更はグローバルには影響しないらしいけど、`autocmd`で変更する値は無難に`setlocal`にしておく
