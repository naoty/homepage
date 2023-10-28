---
title: ECSサービスの分け方
time: 2018-10-02T21:22:00+0900
tags: ["aws"]
---

ECSサービスを作るとき、いくつかパターンがあることに気づいたのでメモ。

1. コンテナのtagごとに作るパターン
2. コマンドごとに作るパターン
3. 環境変数の組み合わせごとに作るパターン
4. スケールアウトの粒度ごとに作るパターン

# コンテナのtag
Dockerコンテナには、コミットIDをtagにするのと同時に、`master`と`develop`ブランチではブランチ名をtagに加えている。productionのappサービスは`master`のtagを使うようにタスク定義を作ってるし、stagingのappサービスは`develop`のtagを使うようにタスク定義を作っている。それぞれタスク定義が分かれているのでサービスも分かれている。

# コマンド
同じDockerコンテナを使っていた場合でも、例えばrailsサービスとsidekiqサービスのように別々のサービスを起動させることがある。こういう場合もそれぞれコマンドごとにタスク定義を作ってサービスを分けることになる。

# 環境変数の組み合わせ
同じDockerコンテナで同じコマンドを実行する場合でも、環境変数を使って例えばDBの接続先やDB名といった外部サービスを変えることがある。環境変数はタスク定義で指定するので、利用する環境変数の組み合わせごとにタスク定義を作り、サービスを作ることになる。

とはいえ、環境変数の指定方法はいくつか考えられるし、サービスディスカバリを使って外部サービスを参照することで環境変数を使わない方法も考えられるので、避けられるかもしれない。

# スケールアウト
特定のパスの負荷が高い場合などに専用のサービスを作って、部分的にスケールアウトさせるということも考えられそう。場合によってはタスク定義も分けて割り当てるリソースを増やすなど最適化させることもありそう。