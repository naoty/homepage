---
title: Circle CIのSlackへの通知を分かりやすくする
description: Circle CIのSlackへの通知にjob名を入れるためにスクリプトを書いた話
time: 2018-06-08T16:23:00+0900
tags: ["circleci"]
---

Circle CI 2.0で導入されたworkflowを使うと、Slackへの通知にどのjobが完了したのかが含まれていなくて困ることがあった。特に失敗したときにどのjobが失敗したのかSlackでは分からないのが不便だった。

そこで、Slackへの通知を分かりやすくするための設定をいくつかしてみたところ、劇的によくなったので紹介したい。

# 通知スクリプトを自作する

```bash
#!/bin/bash -e

payload=$(cat << EOS
{
  "attachments": [
    {
      "title": "Success",
      "title_link": "${CIRCLE_BUILD_URL}",
      "text": "\`workflow/${CIRCLE_STAGE}\` in ${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME} (${CIRCLE_BRANCH})",
      "mrkdwn_in": ["text"],
      "color": "good"
    }
  ]
}
EOS
)

curl \
  -X POST \
  -H 'Content-Type: application/json' \
  --data "${payload}" \
  ${SLACK_WEBHOOK_URL}
```

* Circle CIの連携時に生成されるWebhookを使って通知を送るスクリプトを書いた。
* `attachments`フィールドを使ってリッチなメッセージを作る。
* 環境変数`CIRCLE_STAGE`には、workflow内で実行中のjob名が入っているため、これを使ってどのjobが成功したのか失敗したのかを通知できる。

# 通知スクリプトを設定する

```yaml
jobs:
  test:
    steps:
      # ...
      - run: ./.circleci/notify-success
      - run:
          command: ./.circleci/notify-failure
          when: on_fail
```

* 各jobの最後のstepに成功時の通知を送るスクリプトを設定する。
* `when: on_fail`を設定すると、先に実行されたstepが失敗したときに呼ばれるstepを設定できる。それを利用して、失敗時の通知を送るスクリプトを設定する。
