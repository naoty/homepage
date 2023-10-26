---
title: sidekiqコンテナのヘルスチェック
time: 2018-09-28T22:41:00+0900
tags: ["aws"]
---

ECSでsidekiqをコンテナとして実行するとき、ALBからHTTP経由でヘルスチェックができないので、Dockerのヘルスチェックを利用するといい。

Dockerのヘルスチェックはシェルスクリプトで行うことができ、終了ステータスが0ならhealthy、1ならunhealthyと判断する。そこで、sidekiqのpidfileを出力するように設定し

```
test -f sidekiq.pid
```

でヘルスチェックすればいい。

sidekiqのDockerイメージはRailsアプリケーションのものを再利用することも多いだろうから、ECSではタスク定義内のコンテナ定義で下のようにヘルスチェックを指定する。

```json
[
  {
    "name": "sidekiq",
    "command": ["sidekiq", "--pidfile", "./sidekiq.pid"],
    "healthCheck": {
      "command": ["test", "-f", "./sidekiq.pid"]
    }
  }
]
```
