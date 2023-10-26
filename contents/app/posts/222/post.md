---
title: APNsの概要と関連ツール群
time: 2014-07-07 01:46
tags: ['ios']
---

Apple Push Notification Service（APNs）は、ソフトウェア開発者（プロバイダ）から受け取ったメッセージを安全な方法でデバイスにプッシュ通知するサービスである。

# プッシュ通知までの流れ

1. プロバイダはデバイストークンとペイロードから成る通知メッセージを作る。
2. プロバイダはその通知メッセージをAPNsに送信する。
3. APNsは受け取った通知メッセージのデバイストークンから配信先のデバイスを特定し、通知メッセージを配信する。

# 接続を確立するまでの流れ

1. APNsとデバイス間で認証を行う（システムによって行われるため、開発者が実装する必要はない）。
2. APNsとプロバイダ間で認証を行う。
  1. プロバイダがAPNsからサーバ証明書を取得し、検証する。
  2. プロバイダがプロバイダ証明書をAPNsに送信する。
3. デバイストークンを生成しプロバイダと共有する。
  1. アプリケーションがリモート通知の登録を行う。
  2. システムがリモート通知の設定を行い、デバイストークンをアプリケーションデリゲートに渡す。
  3. アプリケーションがデバイストークンをプロバイダに送信する。
4. プロバイダからの通信すべてにデバイストークンを添付させる。

# APNs関連ツール群

AFNetworkingでおなじみのmatttさんが様々な関連ツールを開発している。それぞれのツールが上で説明した全体像の中でどのような位置づけなのか整理した。

## houston

[https://github.com/nomad/houston](https://github.com/nomad/houston)

プロバイダからAPNsに向けて通知メッセージを送るためのクライアント。Ruby製。上記の通り、プロバイダがAPNsにメッセージを送るには、(1)APNsとの間で認証を行う、(2)配信先のデバイストークンを取得する必要がある。なので、houstonでもメッセージを送る際にAPNsのサーバー証明書と配信先のデバイストークンを設定する必要がある。

## rack-push-notification

[https://github.com/mattt/rack-push-notification](https://github.com/mattt/rack-push-notification)

iOSアプリからデバイストークンを受け取りDBに保存するRackアプリケーション（Sinatraベース）。上述の通り、iOSアプリはAPNsからデバイストークンを取得したあと、プロバイダと共有する必要がある。rack-push-notificationはそのデバイストークンを受け取るためのAPIを用意する。

## Orbiter

[https://github.com/mattt/Orbiter](https://github.com/mattt/Orbiter)

iOSアプリからデバイストークンを送信するためのクライアント。今までの2つのツールはプロバイダ側のツールだったが、OrbiterはiOSアプリ側のツールである。取得したデバイストークンをプロバイダに送信する処理を簡略化できるようだ。

## まとめ

これらの関連ツールを使ったプッシュ通知のフローは以下のようになる。

1. iOSアプリはリモート通知の登録を行い、APNsからデバイストークンを取得する。
2. iOSアプリは **Orbiter** を使ってデバイストークンをプロバイダに送信する。
3. プロバイダは **rack-push-notification** を使って用意したAPIからデバイストークンを受け取りDBに保存する。
4. プロバイダは **houston** を使ってプッシュ通知をAPNsに送信する。
5. APNsはプロバイダ証明書とデバイストークンからプッシュ通知を転送するデバイスを特定しプッシュ通知を送る。

* * *

# 参考

- [LocalおよびPush Notificationプログラミングガイド](https://developer.apple.com/jp/devcenter/ios/library/documentation/RemoteNotificationsPG.pdf)(PDF)
