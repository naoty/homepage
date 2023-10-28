---
title: ブログで使うHTML5
time: 2017-12-03T20:03:00+0900
description: ブログをセマンティックに記述するためのHTML5のタグを調べた
tags: ['html']
---

ブログを作るにあたって適切なセマンティックを使おうと思い、HTML5のタグを調べた。

# レイアウト

```html
<article>
  <header>
    <h1>ブログタイトル</h1>
    <p>公開：<time datetime="2017-12-01T12:00:00.000+0900">2017-12-01 12:00:00</time></p>
  </header>
  <section>
    <h1>見出し1</h1>
    <p>本文</p>
  </section>
  <footer>
    <p><a href="/">トップ</a></p>
  </footer>
</article>
```

* `<article>`：ブログのエントリーを表すために使う。
* `<header>`, `<footer>`：ブログのヘッダーおよびフッターを表すために使う。このブログでは、ブログタイトルやメタデータをヘッダーに表示して、ナビゲーションのリンクをフッターに表示している。
* `<section>`：ブログ本文をヘッダーやフッターと区別して表すために使う。
* `<time>`：ブログのエントリーの公開日時を表すために使う。`datetime`属性によって公開日時を指定できる。

# コード

```html
<figure>
  <figcaption>app/models/pokemon.rb</figcaption>
  <pre>
    <code class="ruby">
    </code>
  </pre>
</figure>
```

* `<figure>`：文書とは別に参考資料として付け加えたコンテンツを表すために使う。画像やコードに対して使えるようだ。
* `<figcaption>`：参考資料のキャプションを表すために使う。

# 画像

```html
<figure>
  <figcaption>図1</figcaption>
  <picture>
    <source srcset="/figure1-large.png, /figure1-large@2x.png 2x" media="(min-width: 600px)">
    <img src="/figure1.png" srcset="/figure1.png, /figure1@2x.png 2x" alt="図1">
  </picture>
</figure>
```

* `<picture>`：条件に合わせて表示する画像を切り替えることができる。レスポンシブデザインをサポートしたり、画像の最適化のために使う。
* `<source>`：複数のリソースを指定するために使う。

# その他
* `<ins>`：追記されたテキストを表すために使う。`datetime`属性に追記日時を指定できる。
* `<del>`：削除されたテキストを表すために使う。`datetime`属性に削除日時を指定できる。
