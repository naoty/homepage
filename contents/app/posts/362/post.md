---
title: terraformとapex infraの依存関係
time: 2019-02-28T23:52:00+0900
tags: ["terraform"]
---

# 背景
AWSの構成管理にterraformを使っているんだけど、Lambda関数とそれに関連するAWSリソースの管理は[apex](https://apex.run)を使っている。apexの方がLambda関数のバージョニングができたり、コードの依存関係を簡単にzipにまとめてアップロードできたりして便利なのだ。

apexには、`apex infra`というコマンドがあり、Lambda関数にAWS関連するリソース（パーミッションとかCloudWatch Logsとか）を管理できる。実際には内部的にterraformを使っている。

# 課題
terraformで管理するリソースと`apex infra`で管理するリソースに明確なボーダーラインを引くことは難しい。apexで管理するLambda関数はterraformで管理するさまざまなリソースと依存関係になっていることがほとんどだからだ。どこで何が管理されているのかわからなってくる。

# 方針
こういうときの考え方として、依存関係の方向性を単方向にすると良かったりする。`apex infra`で管理するリソースはterraformで管理するリソースを参照することができるけど、逆にterraformで管理するリソースは`apex infra`で管理するリソースを参照できない、というルールを作る。

# 実装
`apex infra`からterraformのリソースを参照するために`terraform_remote_state`を使う。ここでは例として、apexで管理するLambda関数をterraformで管理するSNSトピックにsubscribeしたいとする。

```hcl
data "terraform_remote_state" "global" {
  backend = "s3"

  config {
    region = "ap-northeast-1"
    bucket = "my-terraform"
    key    = "global"
  }
}
```

```hcl
resource "aws_sns_topic_subscription" "lambda" {
  topic_arn = "${data.terraform_remote_state.global.my_topic}"
  protocol  = "lambda"
  endpoint  = "${var.apex_function_arns["my_function"]}"
}
```

SNSトピックのARNは事前に`output`でremote stateとして公開しておく必要がある。

こうすることで、terraform側からapexで管理するLambda関数を参照せずに済んでいる。Lambda関数を参照するリソースは`apex infra`で管理し、そうでないリソースはterraformで管理するという方針でうまく整理できそうだ。
