---
title: タグごとのブログ一覧を追加した
time: 2019-05-01T12:24:00+0900
tags: ["meta", "gatsby"]
---

[/go/](/go/) のようにタグごとの一覧画面を追加した。タグがリンクになっている。

Gatsby.jsでは`gatsby-node.js`でテンプレートからページを生成できる。frontmatterに追加したタグをGraphQLで取得してタグごとのページを生成している。
