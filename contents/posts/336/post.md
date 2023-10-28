---
title: パラメータストアで環境変数を管理する
description: パラメータストアから環境変数をセットしてRailsを起動する話
time: 2018-06-08T21:57:00+0900
tags: ["aws", "rails"]
---

最近、ECSで運用しているRailsアプリの起動時にパラメータストアから環境変数を取得して設定するようにした。

## 背景
それまでは環境変数はコンテナ定義に指定されていたが、それをパラメータストアを使った方法に移行した。理由としては、機密情報をコンテナ定義の環境変数に設定するのは推奨されていないからだ。

また、開発環境で利用する環境変数が開発者によってバラバラに管理されていた（ローカルの`.env`ファイルによって管理されていた）ため、新しく開発に参加する際に正しい環境変数が何なのか把握するのが大変だった。

## パラメータストア
パラメータストアとは、AWSが提供する階層型ストレージのことで、設定のような軽いデータを安全に管理できる。KMSによる暗号化も可能なので機密情報を含む環境変数の管理に向いていそうだと判断した。

## 環境変数をパラメータストアに移す
バラバラに管理されていた環境変数をパラメータストアに移した。パラメータストアは階層構造になっており、ある階層下にある値をまとめて取得することができる。

今回は`/<アプリケーション名>/<実行環境>/<環境変数名>`という階層で環境変数を管理することにした。例えば、`/myapp/production/PASSWORD`のような感じだ。

## コンテナからパラメータストアにアクセスする
ECSコンテナからパラメータストアにアクセスするには権限が必要になる。パラメータストアへの移行と同時並行でECSコンテナでIAMロールを使うように修正していたので、このIAMロールにパラメータストアにアクセスするためのポリシーを付与した。

## Rails起動時に環境変数をセットする
環境変数はRailsの起動プロセスの中で参照されることがある（データベースとの接続など）ため、起動プロセスの初期に環境変数を設定する必要がある。

いくつかRubygemがあるようだったが、たいした実装ではないので簡単なコードを書いて環境変数を起動プロセスの初期に設定するようにした。

注意点としては、パラメータストアから取得した環境変数よりも既存の環境変数を優先させた点だ。ECSからタスクとしてコンテナを起動するときなど、コンテナ定義から環境変数を指定することでパラメータストアの環境変数を上書きできると便利なケースがあったからだ。また、開発環境では`docker-compose.yml`で指定した環境変数を優先することも可能になる。