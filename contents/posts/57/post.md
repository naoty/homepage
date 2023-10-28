---
title: Tweetボタンのカスタマイズ
time: 2011-06-09 11:20
---

railsで動的なページにTweetボタンを埋め込みたいので、公式ドキュメント[\*1](#f1 "http://dev.twitter.com/pages/tweet\_button")を見ながら、カスタマイズしてみました。

```
<script src="http://platform.twitter.com/widgets.js" type="text/javascript">script>
<div>
  <a href="http://twitter.com/share" class="twitter-share-button"
       data-count="horizontal"
       data-lang="ja"
       data-related="naoty_k"
       data-text="RT #{@article.title}"
       data-url="#{article_url(@article)}"
       data-via="naoty_k">Tweeta>
div>
```

| 属性 | デフォルト | 意味 | 備考 |
| --- | --- | --- | --- |
| data-count | horizontal | ツイート数をどこに表示するか | horizontal, vertial, noneから選択 |
| data-lang | en | 言語 | |
| data-related | | ツイート後にオススメされるアカウント | 挙動が細かいので公式ドキュメントを参照 |
| data-text | titleタグ内 | ツイート本文 | ここにurlを貼る必要はない |
| data-url | HTTP Referer | ツイート本文に貼られるurl | t.coで短縮される |
| data-via | | ツイート本文末尾に「via @user\_name」をつける | |

[\*1](#fn1):http://dev.twitter.com/pages/tweet\_button
