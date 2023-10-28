---
title: FLOCSSを導入した
time: 2018-02-01T08:48:00+0900
description: FLOCSSを導入しCSSのアーキテクチャを整理した
tags: ["css"]
---

このホームページのCSSを見直して[FLOCSS](https://github.com/hiloki/flocss)を導入した。

さまざまなCSSアーキテクチャが提唱されているけど、仕事でFLOCSSが採用されそうなので試しにやってみようということでやってみた。

ディレクトリ構成はこんな感じ。

```
stylesheets/
├── application.css
├── foundation
│   ├── _base.css
│   └── _variable.css
├── layout
│   └── _base.css
└── object
    ├── project
    │   ├── _homepage.css
    │   ├── _post.css
    │   └── _posts.css
    └── utility
        └── _align.css
```

markdownを変換したHTMLにstyleを与えるという制約上、クラスを使ったstyleを定義しにくい。なので、componentっぽいものもprojectにすべて含めてしまっている。これでいいのかはまだ分かっていないので、他のプロジェクトでも導入して試行錯誤してみたい。

ついでなので、最近意識しているCSSの書き方を挙げておきたい。

* `font-size`, `margin`, `padding`では単位に`rem`を使う。
* `margin-top`を使わない。一貫して`margin-bottom`を使うことで、シンプルにレイアウトを組むことができる。
* `margin-bottom`の値は`<h1>`~`<h6>`と`<li>`を`1`とすると、その他のブロック要素を`2`にする。例えば、このブログでは以下のような感じにしている。

```css
h1,
h2,
h3,
h4,
h5,
h6,
li {
  margin-bottom: 1rem;
}

p,
ul,
ol,
pre,
table {
  margin-bottom: 2rem;
}
```
