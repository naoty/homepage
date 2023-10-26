---
title: deviseで確認メールが送られてこない件を解決
time: 2011-09-28 12:00
tags: ['rails']
---

deviseのconfirmableによって確認メールを送信する機能をカンタンに実装できるんですが、なぜか、確認メールが送られてこない…件を解決したので、メモ。

```
# config/environments/development.rb

  # Don't care if the mailer can't send
  config.action_mailer.raise_delivery_errors = false
  config.action_mailer.default_url_options = { host: 'localhost:3000' }
  config.action_mailer.delivery_method = :sendmail # ←追加！
```

default\_url\_optionsはdeviseをインストールする際に注意されるので設定しましたが、delivery\_methodを指定するのは完全に見落としてました。deviseの設定というより、action\_mailerの設定ですね。

環境

- rails 3.1.0
- actionmailer 3.1.0
- devise 1.4.7
