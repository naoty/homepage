---
title: Firestoreとドメインモデルの間で
time: 2023-03-04 15:41
tags: ['firestore']
---

最近、Firestoreのことやドメインモデリングについて思いをめぐらせることが多いので、感じていることや考えていることを雑にテキストに起こした。

# 非正規化とORマッパー
Firestoreに限らずNoSQLでは、アクセスパターンに合わせて非正規化したスキーマを設計するのがよいとされている。RDBとは異なり、JOINが使えない（MongoDBでは使えるらしい）ため、アプリケーション側で複数回のクエリを実行し結合することになり効率がよくないのが理由のようだ。

RDBでそうしてきたようにORマッパーを使い、Firestoreに格納されたデータとオブジェクトとの間で変換しようとすると、どうしても正規化されたスキーマになりやすいと思う。正規化されたモデルを使ってFirestoreにアクセスすると、上述した通り、アプリケーション側での結合に頼ることになり、readのパフォーマンスが悪化しやすくなると思う。

# 非正規化のための工夫
スキーマを非正規化すると、同じドメインモデルを複数のコレクションに保存することになる。そのため、コレクション間での一貫性を保つための工夫がアプリケーション側に必要になる。例えば、Firestoreへの書き込みを行うメソッドを統一し、複数のコレクションへの書き込みが矛盾なく行われるようにしたり、コレクション間の矛盾を検知しあるべき状態に収束させるワーカープロセスを用意したり、FaaSを利用してあるコレクションのデータを別コレクションにコピーするようにしたり、といった工夫が考えられそうだ。

とはいえ、完璧なプログラムが存在しないように、アプリケーション側での工夫にも限界があり、一貫性を強く求められるシステム（SoRなど）では素直にRDBを使って正規化されたスキーマの上で書き込みをする方が無難だと思う。

# ドメインモデリングとデータモデリング
ドメインモデリングを通してドメインを正確に反映したモデルを抽出できる一方で、それをそのままFirestoreに保存しようとすると、上述の通り、パフォーマンス上の問題が出てくる。なので、非正規化などFirestoreの特性に合わせたデータモデリングも同時に必要になる。

アプリケーションはドメインモデルとデータモデルの溝を埋めるように実装したい。HTTPリクエストをドメインモデルに変換し、ドメインモデルをデータモデルに変換してFirestoreに保存する。そしてその逆を行う。[データ指向アプリケーションデザイン](https://www.oreilly.co.jp/books/9784873118703/)を読み直すとこのようなことを思い起こさせてくれる。