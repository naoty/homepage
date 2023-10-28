---
title: "2020-10-04"
time: 2020-10-04 17:18
tags: ["diary"]
---

# 家計
最近、ファイナンシャルプランナーに相談する機会があり、家計の運用を改善していきたい機運が高まっている。

さっそくMoneyforwardの運用を見直した。[nosh](https://nosh.jp/)やuber eatsなどのデリバリーの出費とスーパーでの買い物を区別したかったので、「中食」という中項目を食費に作った。あとは、コンビニでの支出はコスパが悪いことが多く減らしていきたいと思っているので、これも「コンビニ」という中項目を作って見える化した。

# チーム替え
先月から仕事で所属するチームが替わり、インフラ寄りの業務からRailsアプリケーションをVue.jsと共に実装する業務に替わった。運用の仕事も学びが多くて楽しかったけど、アプリケーションを実装する方が性に合っている気がする。

およそ3年ぶりにスクラムによる開発現場に入ることになった。違う会社の違うスクラムにとまどうことが多い。開発者が自らステークホルダーとプロダクトバックログアイテムの具体化やリリーススケジュールの調整までおこなうことを期待されている。そういった業務はプロダクトオーナーがやるものだと思っていたけど、どうやら違うようなので適応していくしかない。

そういうわけで最近はプログラミングに関することがらよりも、プロダクト開発のプロセスに関心が高まっている。この前、IPAが公開している[「家づくりで理解する要求明確化の勘どころ」](https://www.ipa.go.jp/sec/reports/20180327.html)という資料を読んでいた。今は[「正しいものを正しくつくる」](https://beyondagile.info/)という本を読んでいる。

# 過去記事のインポート
このホームページより前にはてなブログやQiitaに書いていた記事をこのホームページにインポートする作業をしている。プログラミングを始めた頃の貴重な記録はいつまでも残しておきたい。

Qiitaの記事はmarkdownとしてエクスポートできるためスムーズにインポートできそう。一方ではてなブログの全記事はMovable Type形式の1ファイルにまとめてエクスポートされ、ブログ本文はHTMLとして出力されるため、不要なタグを取り除いてmarkdown形式に変換するのに苦労している。はてなキーワードへのリンク、シンタックスハイライト用のspanタグ、コードスニペット内のtabインデント、はてなブログ独自のウィジェットなど、そのままmarkdown形式に変換できないものを泥臭く処理する必要がある。

変換作業が一通り済んだらブログ記事だけのリポジトリをブログを生成するコードとは別に作ったり、ブログだけをblog.naoty.devのようなサブドメインに移したりしたい。