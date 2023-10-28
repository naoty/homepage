---
title: 自分専用のtodo管理ツールを書いた
time: 2015-05-23 17:17
tags: ['oss']
---

最近、プライベートでの開発したいことや勉強したいことが増えてきたので、それらを管理するツールを書いた。

[naoty/todo](https://github.com/naoty/todo)

# 使い方

```
$ todo add Go言語を勉強する
$ todo add todo管理ツールを書く
$ todo add ブログ記事を書く
$ todo list
[] 001: Go言語を勉強する
[] 002: todo管理ツールを書く
[] 003: ブログ記事を書く
$ todo done 1
$ todo done 2
[x] 001: Go言語を勉強する
[x] 002: todo管理ツールを書く
[] 003: ブログ記事を書く
$ todo clear
$ todo list
[] 001: ブログ記事を書く
```

その他、todoの削除や移動などができる（詳細はGitHubのページを参照）。個人的に便利だと思っている機能がtodoをmarkdownのtask list形式で出力する機能だ。

```
$ todo list -m
- [x] Go言語を勉強する
- [x] todo管理ツールを書く
- [] ブログ記事を書く
```

これを使ってQiita:Teamの日報に今日やったこと、やれなかったことを簡単にコピペできる。一日の作業フローはこうだ。

1. `todo list`で残タスクを確認する。
2. 適宜`todo add`でタスクを追加したり、`todo move`で順番を入れ替えて優先度を調整する。
3. 完了したら`todo done`でタスクを完了させる。
4. 一日の終わりに`todo list -m`で作業内容を出力してQiita:Teamにコピペして、感想などを付け加えて日報として公開する。
5. `todo clear`で完了したタスクを消去する。

## tips

- todoはLTSV形式のファイルとして保存され、ファイルのパスは`TODO_PATH`という環境変数で指定できる（デフォルトは`HOME`）。なので、環境変数でDropbox内のパスを指定すれば簡単にtodoを同期できる。
- [zimbatm/direnv](https://github.com/zimbatm/direnv)を使うと、プロジェクトルートに`cd`したときに`TODO_PATH`を書き換えられるのでプロジェクトのスコープのtodoを別に管理できる。

# 実装

最近はGoが気に入っているので、コマンドラインツールを作るときはすべてGoで書いている。CLIを作る際のフレームワークはいくつかあるようだが、一番Starが多そうだった[codegangsta/cli](https://github.com/codegangsta/cli)を使っている。標準の出力とmarkdown形式の出力の切り替えを実装する際に`interface`を使ってみた。ファイルの入出力には`ioutil`パッケージが手っ取り早かった。ファイルの扱いを通じて`io.Writer`インターフェイスについても理解が深まった。

# done

```
$ todo done 1
```
