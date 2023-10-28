---
title: さくらVPSでRailsを動かすまでのTodo
time: 2011-10-28 19:43
tags: ['rails']
---

苦労の末、とうとうサーバーでRailsが動いたので、記念メモ。  
どんどん加筆していく予定です。

> - プラン：さくらのVPS 512（いちばん安いやつ。月980円）
> - OS：CentOS 5.5 x86\_64
> - ruby 1.9.2
> - Rails 3.1.0
> - webサーバー：nginx
> - appサーバー：unicorn
> - DB：MySQL
> - repo：bitbucket

- rootユーザーのパスワードを設定する
- 作業用ユーザーを作成する
- 作業用ユーザーのパスワードを設定する
- su, sudoの権限を制限する
- $PATHを追加する
- パスワード認証から公開鍵認証に変更する
- rootでのログインを禁止する
- sshのポートを22番から変更する
- iptablesによるパケットフィルタリングを設定する
- yumをアップデートする
- gitをインストールする
- rvmをインストールする
- ruby1.9.2をインストールする
- mysqlをrpmでインストールする
- nginxをビルド
- nginxの自動起動を設定する
- unicorn、bundlerをgemにインストール
- bitbucketからプロジェクトをgit clone
- bundle install --path vendor/bundle
- 本番用DB作成
- マイグレーション
- unicornの設定ファイル（config/unicorn.rb）を作成して、unicornを起動
- unicornに合わせてnginxの設定ファイル（nginx.conf）を修正して、リロード
- 静的ファイルのプリコンパイルの設定を変更

参考図書

[![ハイパフォーマンスHTTPサーバ Nginx入門](http://ecx.images-amazon.com/images/I/51xpswg%2BkkL._SL160_.jpg "ハイパフォーマンスHTTPサーバ Nginx入門")](http://www.amazon.co.jp/exec/obidos/ASIN/4048702270/hatena-hamazou-22/)

[ハイパフォーマンスHTTPサーバ Nginx入門](http://www.amazon.co.jp/exec/obidos/ASIN/4048702270/hatena-hamazou-22/)

- 作者: Clement Nedelcu,長尾高弘
- 出版社/メーカー: アスキー・メディアワークス
- 発売日: 2011/04/21
- メディア: 大型本
- 購入: 2人 クリック: 589回
- [この商品を含むブログ (15件) を見る](http://d.hatena.ne.jp/asin/4048702270)

  

[![エキスパートのためのMySQL[運用+管理]トラブルシューティングガイド](http://ecx.images-amazon.com/images/I/41oqE-9dM2L._SL160_.jpg "エキスパートのためのMySQL[運用+管理]トラブルシューティングガイド")](http://www.amazon.co.jp/exec/obidos/ASIN/4774142948/hatena-hamazou-22/)

[エキスパートのためのMySQL[運用+管理]トラブルシューティングガイド](http://www.amazon.co.jp/exec/obidos/ASIN/4774142948/hatena-hamazou-22/)

- 作者: 奥野幹也
- 出版社/メーカー: 技術評論社
- 発売日: 2010/06/12
- メディア: 大型本
- 購入: 11人 クリック: 175回
- [この商品を含むブログ (24件) を見る](http://d.hatena.ne.jp/asin/4774142948)
