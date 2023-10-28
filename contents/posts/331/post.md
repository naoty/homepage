---
title: awscliのwaitコマンドが便利だった
description: waitコマンドによってデプロイスクリプトが簡単に書けるようになった話です
time: 2018-04-22T09:55:00+0900
tags: ["aws"]
---

ECSにデプロイするスクリプトを書くとき、`wait`コマンドがとても便利だった。

デプロイする前にいくつかのECSタスクを実行し完了を待ってからデプロイしたい場合、ECSタスクのステータスをポーリングして完了したかどうかを監視する必要がある。`aws ecs run-task`は即座に終了し、タスクの実行自体は非同期に行われるからだ。

そうしたとき、`wait`コマンドを使うと簡単にポーリングを行うことができる。

```bash
aws ecs wait tasks-stopped --tasks ${task_arn1} ${task_arn2}
```

これは`aws ecs describe-tasks`を定期的に実行してレスポンスからステータスを取得し、それが完了するまで待つ。`--tasks`オプションはECSタスクのARNを複数指定できるので、複数のタスクがすべて完了するのを待つことができる。

ECSタスクのARNは`aws ecs run-task`のレスポンスから取得できる。実際にはこんな感じで書くと思う。

```bash
task_arn1=$(aws ecs run-task \
  --task-definition my-task-definition \
  --query "tasks[0].taskArn" \
  --output text)

aws ecs wait tasks-stopped --tasks ${task_arn1}
```

気をつける必要があるのは、ECSタスクが完了したかどうかは分かるものの、それが成功したのか失敗したのかは分からないということだ。なので、`wait`の後で`describe-tasks`によって失敗したかどうかをチェックする必要があるとおもう。

`wait`コマンドはタスクの完了だけでなくサービスのステータスの監視でも使えるし、またECS以外にもEC2などで使えるのでawscliを使ったスクリプトを書くときには今後もお世話になりそう。
