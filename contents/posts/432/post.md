---
title: rake/testtask
time: 2020-10-17 23:23
tags: ["ruby", "test"]
---

minitestでテストを書いたことがなかったので、まずはテストの実行方法を調べてみた。すると、[`rake/testtask`](https://docs.ruby-lang.org/ja/latest/class/Rake=3a=3aTestTask.html)というライブラリを使うと簡単にテストのためのrakeタスクを定義できることがわかった。

```ruby
# Rakefile
require "rake/testtask"

Rake::TestTask.new do |task|
  task.libs = ["lib", "test"]
  task.test_files = FileList["test/**/*.rb"]
end
```

* `#libs=`でテスト実行前に`$LOAD_PATH`に指定したパスを追加できる。`require "test_helper"`みたいに書けるのはこれのおかげ。
* `#test_files=`でテスト対象を指定できる。

テストの実行はこんな感じ。

```bash
# 全テストを実行
% rake test
# ファイルを指定して実行
% rake test TEST=test/foo_test.rb
# メソッドを指定して実行
% rake test TESTOPTS="--name=test_foo"
```
