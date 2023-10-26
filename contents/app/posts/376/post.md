---
title: ECSタスクでRakeタスクを定期実行する
time: 2019-07-04T23:27:00+0900
tags: ["aws", "rails", "terraform"]
---

ECSサービスとしてRailsアプリケーションを運用しているとき、定期実行したいRakeタスクはcronで管理するよりもECS scheduled taskとして管理すると思う。

まず、RakeタスクをECS（Fargate）上で実行するため、ECSタスク定義をつくる。

```hcl
resource "aws_ecs_task_definition" "rake" {
  family                   = "rake"
  task_role_arn            = aws_iam_role.ecs_task.arn
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  requires_compatibilities = ["FARGATE"]

  container_definitions  = <<DOCUMENT
[
  {
    "name": "rails",
    "image": "${aws_ecr_repository.rails.repository_url}:latest",
    "command": ["exit", "1"],
    "environment": [
      { "name": "RAILS_ENV", "value": "production" }
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${aws_cloudwatch_log_group.rails.name}",
        "awslogs-region": "ap-northeast-1",
        "awslogs-stream-prefix": "rake"
      }
    }
  }
]
DOCUMENT
}
```

* 定期実行したいRakeタスクごとにECSタスク定義を作るのは非効率なので、Rakeタスク専用のタスク定義をつくる。
* 後ほど、実行するコマンドをoverrideするため、タスク定義のコマンドでは`exit 1`を実行するようにしている。

```hcl
resource "aws_cloudwatch_event_rule" "push_notifications_schedule" {
  name                = "push-schedule"
  schedule_expression = "cron(0 20 * * ? *)"
}

resource "aws_cloudwatch_event_target" "push_notifications" {
  rule     = aws_cloudwatch_event_rule.push_notifications_schedule.name
  arn      = aws_ecs_cluster.production.arn
  role_arn = aws_iam_role.ecs_events.arn

  ecs_target {
    launch_type         = "FARGATE"
    task_count          = 1
    task_definition_arn = aws_ecs_task_definition.rake.arn

    network_configuration {
      subnets         = [aws_subnet.private_a.id, aws_subnet.private_c.id]
      security_groups = [aws_security_group.internal.id]
    }
  }

  input = <<DOCUMENT
{
  "containerOverrides": [
    {
      "name": "rails",
      "command": ["bin/rails", "push_notifications"]
    }
  ]
}
DOCUMENT
}
```

* `aws_cloudwatch_event_rule`はスケジュールごとに書き、そのスケジュールで実行するRakeタスクごとに`aws_cloudwatch_event_target`を書くことになる。なので、production環境とstaging環境で同じスケジュールを使う場合は、`aws_cloudwatch_event_rule`は共用することになる。
* `aws_cloudwatch_event_target`では、`ecs_target`でFargate上でECSタスクを実行するためのオプションを指定する必要がある。`input`でコンテナ定義のoverrideができるので、ここで`exit 1`としていた実行コマンドをoverrideしている。
