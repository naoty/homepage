---
title: IntelliJ IDEAをvimっぽくする
time: 2013-01-04 23:41
---

Androidアプリ開発しててEclipseが重くてつらかったので、IntelliJ IDEAなるものを試してる。見た目がかっこいいからこっち使ってみようと思い、vimっぽく使えるか試してみた。

## バージョン

- IntelliJ IDEA 12.0

## テーマを黒にする

- こっちの方がイケてる。
- `Preferences > Appearance > Theme`をDarculaに変更する。

![f:id:naoty_k:20130104233050p:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20130104/20130104233050.png "f:id:naoty\_k:20130104233050p:plain")

## IdeaVimを追加

- キーマップをvim化する。
- `Preferences > Plugins > Browse repositories > IdeaVim`でダブルクリックするとインストールできる。

![f:id:naoty_k:20130104233555p:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20130104/20130104233555.png "f:id:naoty\_k:20130104233555p:plain")

## カーソルがどこまでも右にいける設定をオフにする

- `Preferences > Editor > Allow placement of caret after end of line`をオフにする。

![f:id:naoty_k:20130104233620p:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20130104/20130104233620.png "f:id:naoty\_k:20130104233620p:plain")

## 行番号を表示する

- `Preferences > Editor > Appearance > Show line numbers`をオンにする。

![f:id:naoty_k:20130104233646p:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20130104/20130104233646.png "f:id:naoty\_k:20130104233646p:plain")

## キーマッピングをカスタマイズする

- `Preferences > Keymap`からいろいろ変更できる。
- `Second Stroke`を指定することでPrefixみたいなキーマッピングも設定できる。
- 変更したのは以下のとおり。これでだいたいvimと同じ動きになる。
- `Run`：実行
- `Select Next Tab`, `Select Previous Tab`：タブを前後に移動
- `Recent Files`：最近開いたファイルのファイラーを起動（unite.vimっぽく使える）
- `Split Horizontally`, `Split Vertically`：エディタを水平分割、垂直分割
- `Goto Next Splitter`, `Goto Previous Splitter`：分割したエディタを前後に移動
- `Close`：エディタを閉じる

![f:id:naoty_k:20130104233706p:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20130104/20130104233706.png "f:id:naoty\_k:20130104233706p:plain")

Eclipseだとタブの移動とか画面分割をショートカットからできなかった気がするので、これだけでもインテリJ氏に替える価値があると思う。作業効率がだいぶ上がる。
