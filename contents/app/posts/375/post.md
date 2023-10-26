---
title: 特定のIPアドレスからのアクセスを許可する
time: 2019-07-03T23:46:00+0900
tags: ["aws", "terraform"]
---

ステージング環境などの社内だけに公開されるような環境を構築するとき、特定のIPアドレスからのアクセスを許可するセキュリティグループを作ると思う。

僕はいつもこんな感じでTerraformのリソースを書く。

```hcl
locals {
  office_ips = [
    "192.0.2.1",
    "198.51.100.1",
    "203.0.113.1",
  ]
}

resource "aws_security_group" "office" {
  name   = "office"
  vpc_id = aws_vpc.main.id
}

resource "aws_security_group_rule" "office_ingress" {
  count = length(local.office_ips)

  security_group_id = aws_security_group.office.id
  type              = "ingress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["${local.office_ips[count.index]}/32"]
}

resource "aws_security_group_rule" "office_egress" {
  security_group_id = aws_security_group.office.id
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
}
```

* 特定のIPアドレスはローカル変数でまとめておく。
* IPアドレスごとにインバウンドトラフィックを許可するルールを設定するため、`aws_security_group.ingress`を使わずに`aws_security_group_rule`を使う。その方が`count`を使って効率的に書ける。
* この書き方はNetwork ACLでも使える。

日々のTerraform業務の中で見つけたパターンをちょっとずつブログに残していきたいと思い、1トピック1ブログの体裁で書いていくことにした。まずは、だいたい必要になるようなアクセス制限の書き方を書いてみた。次もこれくらいの粒度のブログをリズムよく書いていきたい。

---

## 追記：2019-07-19
terraform v0.12で導入された[dynamic block](https://www.terraform.io/docs/configuration/expressions.html#dynamic-blocks)を使うと、`aws_security_group_rule`を使う必要がないことに気づいた。

```hcl
resource "aws_security_group" "office" {
  name   = "office"
  vpc_id = aws_vpc.main.id

  dynamic "ingress" {
    for_each = local.office_ips

    content {
      from_port   = 0
      to_port     = 0
      protocol    = "-1"
      cidr_blocks = ["${ingress.value}/32"]
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```
