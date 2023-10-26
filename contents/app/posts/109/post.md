---
title: ファイルのパスを絶対パスに変換
time: 2012-04-04 16:12
tags: ['ruby']
---

unicorn.rb等の設定ファイルやスクリプトでよく使うのでメモ。

```
File.expand_path('tmp/sample_data.csv', ENV['RAILS_ROOT'])
```

複数の環境で実行されるコードで相対パスを使うとけっこうハマるので、railsのプロジェクトのルートを使って相対パスを絶対パスに変換する。
