---
title: MailHogによるメールの受信確認
description: コンテナ中心の開発環境ではMailHogを使ってメールの受信確認を行うのが便利だった
time: 2018-02-18T21:53:00+0900
tags: ["docker"]
---

メール送信機能を開発する際、メールの受信を確認したい。従来のRailsアプリ開発では、[letter_opener](https://github.com/ryanb/letter_opener)のようなライブラリを使っていた。

現在のコンテナを中心とした開発環境では、Railsの外側にSMTPサーバーのコンテナを用意し、環境変数によって接続先を設定する方法が一般的ではないかと思った。調べてみると、[MailHog](https://github.com/mailhog/MailHog)というツールが見つかった。MailHogはSMTPサーバーであり、かつ受信したメールを確認できるHTTPサーバーも兼ね備えている。

MailHogはDocker Hubでコンテナを公開しているため、docker-composeを使うと簡単に開発環境に組み込むことができる。

```yaml
# docker-compose.yml
services:
  web:
    build: .
    command: bin/rails s -p 3000 -b 0.0.0.0
    environment:
      SMTP_HOST: mail
      SMTP_PORT: 1025
    depends_on:
      - mail
  mail:
    image: mailhog/mailhog
    ports:
      - 8025:8025
```

Railsではこんな感じで環境変数によってメールの送信先を設定するだけでいい。

```ruby
# application.rb
config.action_mailer.delivery_method = :smtp
config.action_mailer.smtp_settings = {
  address: ENV["SMTP_HOST"],
  port: ENV["SMTP_PORT"],
}
```

本番環境などでは、この環境変数を実際に運用するSMTPサーバーのものに替えるだけでいい。
