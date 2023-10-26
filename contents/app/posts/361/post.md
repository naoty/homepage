---
title: 自分のコンテナインスタンスIDを確認する
time: 2019-02-24T10:56:00+0900
tags: ["aws"]
---

コンテナインスタンス内で自分自身のコンテナインスタンスIDをたまに取得したいときがあって、そういうときはコンテナインスタンスにログインして、こんな感じのコマンドを実行する。

```bash
curl -s http://localhost:51678/v1/metadata | jq -r .ContainerInstanceArn | cut -d '/' -f 2
```

`http://localhost:51678/v1/metadata`はコンテナインスタンス内で動くecs-agentが公開しているエンドポイントで、メタデータを返してくれる。コンテナインスタンスIDを返してくれるわけではないので、ARNから強引に抽出していく。

参考: https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/ecs-agent-introspection.html
