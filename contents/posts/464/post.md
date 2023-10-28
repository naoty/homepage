---
title: 図で理解するトランザクション競合パターン
time: 2022-01-15 23:16
tags: ["db"]
---

古くからある有名な問題なのだけど、文章で何回読んでも頭にすんなり入らないので、できるだけシンプルに理解するため図を書いて整理してみた。

# Dirty Reads

![Dirty Reads](./dirty-reads.png)

* コミットしていない変更が他のトランザクションから見える。

# Dirty Writes

![Dirty Writes](./dirty-writes.png)

* コミットしていない変更が他のトランザクションに上書きされる。

# Non-Repeatable Reads

![Non-Repeatable Reads](./nonrepeatable-reads.png)

* 同じトランザクションでも読み取るタイミングによって結果が変わり整合性がとれなくなる。
* Dirty Readsとの違いはコミットされた変更によっても影響を受ける点。
* バックアップや分析用途でのクエリで問題になりうる。

# Lost Updates

![Lost Updates](./lost-updates.png)

* 2つ目の変更が1つ目の変更を踏まえていないため、1つ目の変更が失われる。
* 前の値に基づいて変更する処理が並行する場合に発生する。
* 例: カウンターの更新、JSONの書き換え

# Phantom Reads

![Phantom Reads](./phantom-reads.png)

* 変更すべきか判断する条件が判断後に別のトランザクションによって影響を受ける。
* 「条件の確認」「変更すべきか判断」「変更」という3ステップの処理が並行する場合に発生する。
* 例: 会議室の予約（会議室が空いていれば予約）、商品の購入（在庫があれば購入）
