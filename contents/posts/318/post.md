---
title: PostCSSを導入した
time: 2018-01-24T16:27:00+0900
description: PostCSSを導入することでSASSからcssnextに移行した
tags: ["css"]
---

このGitHub pagesのstylesheetは、これまでSASSで記述されGulpのパイプラインで処理されたCSSだった。今回、PostCSSを導入した。理由としては、PostCSSを通してマルチブラウザへの効率的な対応やCSSのlintを行いたかったからだ。

PostCSSの導入にともなって、SASSで記述していたstylesheetをcssnextで書き換えた。SASSのような独自記法を覚えるよりも標準的な規格を覚える方が学習コストを回収しやすい。ちょうどCoffeeScriptからECMAScript 6への移行と同じような感じだ。

導入したPostCSSプラグインは以下の通り。

* `postcss-cssnext`：cssnextを導入する。これでcssで変数を利用したり、ネストした書き方ができる。`autoprefixer`が内部で使われており、サポートするブラウザに基づいてベンダープレフィックスを付与してくれる。
* `postcss-import`：`@import`で宣言した外部のファイルを1つのファイルにまとめることができる。
* `stylelint`：CSSのlintを行う。
* `cssnano`：CSSの圧縮を行う。
