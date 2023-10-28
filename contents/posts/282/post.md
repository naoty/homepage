---
title: Xcodeのカラーパレットを作るコマンドをSwiftで書いた
time: 2016-03-17 10:00
tags: ['oss']
---

![f:id:naoty_k:20160317020138g:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20160317/20160317020138.gif "f:id:naoty\_k:20160317020138g:plain")

[naoty/clr](https://github.com/naoty/clr)

`clr`というコマンドラインツールをSwiftで書いた。上のスクリーンキャストにあるようにXcodeで使うカラーパレットをターミナルから作成できる。

近年ではStoryboard（かつてはXib）がどんどん進化しているので、見た目に関する設定はコードじゃなくてStoryboardに任せたいなという気持ちがある。特に色については、コードでやろうと思うと`UIColor`のextensionをひとつひとつ書いていく感じになると思うけど、カラーパレットを自作する手もあるなということに最近気づいた。カラーパレットを使うと2、3回クリックするだけで色を指定できるから簡単だと思う。

技術的な解説をすると、自作したカラーパレットは実は`$HOME/Library/Colors/`以下に`*.clr`という拡張子で保存されていて、このファイルを共有すれば他の開発者とカラーパレットを共有できる。ただ、これをXcodeでポチポチ自作するのはけっこう大変なので、これをコマンドラインから作れるようにした。カラーパレットは`NSColorList`というOSXの`AppKit`フレームワークにあるクラスで表されていて、`-writeToFile(_:)`というメソッドでファイルに出力できる。なので、`NSColorList`を操作するコマンドラインツールをSwiftで実装した。

### 参考

- [XCode Tip: Color Palette](https://www.natashatherobot.com/xcode-color-palette/)
