---
title: 2017年に作ったもの
time: 2017-12-21T23:00:00+0900
description: 2017年に作ったものを振り返りました
tags: ["diary", "oss"]
---
2017年も終わろうとしているので、今年作ったものを振り返ってみた。こうやって振り返ってみると、今年もたくさん作った。今も使っているものもあるし、使っていないものもある。

自分が抱えている問題を自分のコードで解決できるというのは、豊かな体験だとおもっている。来年も続けていけるように今年を振り返る。

# 使っているもの

## [table](https://github.com/naoty/table)

```bash
$ echo "day\tDAU\n2017-01-01\t10000\n2017-01-02\t8000" | table -H
+------------+-------+
| day        | DAU   |
+------------+-------+
| 2017-01-01 | 10000 |
| 2017-01-02 | 8000  |
+------------+-------+
```

`table`はタブ区切りの文字列をASCIIのテーブル形式に変換する。Google Spreadsheetなど表形式のテキストをSlackにコピペしたくて作った。そんなに使う頻度は多くないけど、使うときはとても便利でたまに使う。

## [homebrew-misc](https://github.com/naoty/homebrew-misc)

```bash
$ brew tap naoty/misc
```

自作のちょっとしたツールを簡単にインストール・アンインストールするためにリポジトリを作った。今年作ったツールはここからHomebrewでインストールできるようにした。プライベートのPCで作ったツールを業務用のPCでインストールするときにラクなので作ってよかった。

## fish-*
fishのためのプラグインをいくつか書いた。今年からzshからfishに移行した。fishにはfishermanというプラグイン管理ツールがあり、簡単にfishの機能を拡張できる。pecoを使ったスクリプトやプロンプトまでプラグインとして作った。

## [license](https://github.com/naoty/license)

```bash
$ license > LICENSE
```

MITのLICENSEファイルを出力するだけのツール。新しいリポジトリを作るときは初手で上を実行している。

## [git-misc](https://github.com/naoty/git-misc)

```bash
$ git prune-branch
$ git tag-timestamp
```

git-miscにはgit関連のスクリプトがいくつか入っている。その中でも`git-prune-branch`という不要なbranchを削除するコマンドはほぼ毎日使っている気がする。

## [nippo](https://github.com/naoty/nippo)

```bash
$ nippo
```

`nippo`はその名の通り日報を作るためのスクリプト。`2017-12-21.md`のようなファイル名でファイルを作成してエディタを起動する。今年は10月くらいから毎日日報をつけるようにした。このスクリプトのおかげで続いていると言っても過言ではないと思う。

## [icon](https://github.com/naoty/icon)

```bash
$ icon
```

`icon`は自分のアイコンを生成するためのツール。引数を指定することで自由なサイズで生成できるので、ダミー画像を作る用途でも使える。

## [homepage](https://github.com/naoty/homepage)
このGitHub Pagesを管理するためのリポジトリ。既存の静的サイトジェネレーターを使わずにGulpプラグインだけでページを生成するようにしている。おかげで自由にカスタマイズすることができており、いまのところこのGitHub Pagesに移行してよかったと思っている。

# 使ってないもの

## [flock](https://github.com/naoty/flock)
`flock`はSwiftのソースコードから依存関係を抽出し、dot形式のファイルを出力する。今年はほとんどSwiftを書いていないので使う機会がなかった。

## [Task](https://github.com/naoty/Task)
TaskはWebフロントエンドの技術を学ぶために作ったElectronアプリで、[naoty/todo](https://github.com/naoty/todo)のGUI版を意識して作った。CUIをそのままGUIにしただけでは、利便性ではCUIの方が優れていたため使うことはなかった。もう少しGUIの良さを活かしたタスク管理アプリケーションを作ってみたい。

## [focus-theme](https://github.com/naoty/focus-theme)
はてなブログのために作ったテーマ。CSSの勉強のために書いてみた。結局、後述するGitHub Pagesに移行したため使わなくなった。

## [brewery](https://github.com/naoty/brewery)
`brewery`はHomebrewのformulaを作るためのツール。SHA256を生成するのがだんだんつらくて作ったけど、`shasum`を知ってから使う必要がなくなってしまった。
