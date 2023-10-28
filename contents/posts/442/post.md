---
title: Auroraのレプリケーション
time: 2021-05-02 16:49
tags: ["db", "aws"]
---

[データ指向アプリケーションデザイン](https://www.oreilly.co.jp/books/9784873118703/)（以下、本書）のレプリケーションの章を読んだ。そこで、MySQL互換のAmazon Auroraのレプリケーションについて調べてみた。

Aurora MySQLのレプリケーションはAurora組み込みのものと、MySQLのものを選択できる。今回は前者について調べた。

# クラスターボリューム
Auroraのデータはクラスターボリュームと呼ばれる単一の論理ボリュームに保存される。クラスターボリュームは1つのリージョンの3つのAZにある各2個のノード、計6個のノードから構成される。

クラスターボリュームはDBインスタンスとは独立しており、クラスターに含まれるDBインスタンスはこれを共有している。プライマリのみがこれへの書き込みを許可されており、レプリカは読み取りしかできない。

# クオラム書き込み
プライマリに書き込まれたデータは6個のノードにコピーされる。ただし、6個のうち4個のノードに書き込まれた時点でプライマリへの書き込みに対して成功を返す。こうすることで、ネットワーク障害などで一部のノードに遅延が発生した際でも影響を受けにくくなる。こういった手法を本書ではクオラム書き込みと読んでいる。

リーダーレスレプリケーションの説明のなかで登場したけど、シングルリーダーのレプリケーションでもクオラム書き込みが使われているのは発見だった。

# 参考
* https://aws.amazon.com/jp/blogs/news/amazon-aurora-under-the-hood-quorum-and-correlated-failure/
* https://aws.typepad.com/sajp/2017/02/introducing-the-aurora-storage-engine.html