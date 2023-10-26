---
title: Railsでのread-after-write一貫性の保証
time: 2021-05-03 22:39
tags: ["rails", "db"]
---

[データ指向アプリケーションデザイン](https://www.oreilly.co.jp/books/9784873118703/)（以下、本書）のレプリケーションの章を読み終わった。非同期的なレプリケーションにおいてネットワークの遅延などによってレプリケーションラグが大きくなると、以下の3つの問題が起こると説明されていた。

* 自分が書いた内容の読み取り
* モノトニックな読み取り
* 一貫性のあるプレフィックス読み取り

Railsアプリケーションを実装する際、これらのうち自分が書いた内容の読み取りに具体的にどう対処するか考えてみる。

# read-after-write一貫性
これはあるユーザーが書いた内容がレプリケーションラグによってリードレプリカになかなか反映されず読み取れない問題を指している。自分が書いたデータを自分で読み取れることをread-after-write一貫性とか、read-your-writes一貫性とか呼ぶ。

この問題の解決策としては、書き込み後から一定期間までは必ずプライマリーから読み取るようにするといい。

Rails 6から導入された複数データベースのサポートには、こういった実装が簡単にできるようになっている。[`ActiveRecord::Middleware::DatabaseSelector`](https://github.com/rails/rails/blob/85c6823b77b60f2a3a6a25d7a1013032e8c580ef/activerecord/lib/active_record/middleware/database_selector.rb)と関連するクラスによって、最後に書き込まれてからデフォルトで2秒間はプライマリーから読み取るようになる。設定でこの時間は変更できる。

```ruby
config.active_record.database_selector = { delay: 2.seconds }
```

デフォルトでは最後に書き込まれた時間はセッション情報の中に記録される（[実装](https://github.com/rails/rails/blob/85c6823b77b60f2a3a6a25d7a1013032e8c580ef/activerecord/lib/active_record/middleware/database_selector/resolver/session.rb#L38-L40)）ため、クロスデバイスでのread-after-write一貫性を保証するには、セッションストアにcookieではなくRedisなどを使うことになりそう。
