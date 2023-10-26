---
title: JSONをASCIIテーブルで表示する
description: naoty/tableにJSONをASCIIテーブルに表示する機能を追加した
time: 2018-03-05T17:34:00+0900
tags: ["oss"]
---
もともとTSV形式の文字列をASCIIやMarkdown形式のテーブルに変換するコマンドだった[naoty/table](https://github.com/naoty/table)を改善して、JSON形式の文字列を受け取れるようにした。

例えば、以下のようなJSONファイルがあったとする。

```json
// pokemons.json
[
  {
    "id": 1,
    "name": "bulbasaur"
  },
  {
    "id": 2,
    "name": "ivysaur"
  },
  {
    "id": 3,
    "name": "venusaur"
  }
]
```

このとき、以下のようにパイプで`table`コマンドに渡すとASCII形式に変換できる。

```shell
$ cat pokemons.json | table -f json:ascii
+----+-----------+
| id | name      |
+----+-----------+
| 1  | bulbasaur |
| 2  | ivysaur   |
| 3  | venusaur  |
+----+-----------+
```

`table`コマンドは出力フォーマットとしてMarkdown形式のテーブルも選べるので、以下のように出力できる。

```shell
$ cat pokemons.json | table -f json:markdown
| id | name      |
| -- | --------- |
| 1  | bulbasaur |
| 2  | ivysaur   |
| 3  | venusaur  |
```

# モチベーション
最近、AWSの作業をすることが増えてAWS CLIから返ってくるJSONを扱うことが増えた。返ってきたJSONを`jq`コマンドで整形して表示するのだけど、件数が増えるとかなり見にくかった。そこで、このような機能を追加してASCIIテーブルとして見やすくしたかったので追加してみた。

例えば、ECSのあるタスク定義に含まれるイメージを知りたいとき、こんな感じでやることになりそう。

```shell
$ aws ecs describe-task-definition --task-definition hello_world:8 | \
  jq ".taskDefinition.containerDefinitions | map({name: .name, image: .image})" | \
  table -f json:ascii
+-----------+-----------+
| name      | image     |
+-----------+-----------+
| wordpress | wordpress |
| mysql     | mysql     |
+-----------+-----------+
```
