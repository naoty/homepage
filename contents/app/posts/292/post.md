---
title: Homebrew にコントリビュートした
time: 2017-02-28 09:58
tags: ['oss']
---

# あらすじ

<iframe src="http://naoty.hatenablog.com/embed/2017/02/20/223011" title="Homebrewで自作Formulaを作るときの落とし穴 - AnyType" class="embed-card embed-blogcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 190px; max-width: 500px; margin: 10px 0px;"></iframe>

前回、 [naoty/todo](https://github.com/naoty) というツールを Homebrew で配布しようとしたときにとある問題にハマった。 `todo` という名前を持つファイルが `README.md` や `LICENSE` のようなメタファイルとして判断されエラーが起きてしまうという問題だった。

# Homebrew に Pull request を送った

[Exclude executables from metafiles by naoty · Pull Request #2106 · Homebrew/brew · GitHub](https://github.com/Homebrew/brew/pull/2106)

前回は、メタファイルではない適当な名前の空ファイルを置いてこの問題を回避していたが、なんというか負けな気がしてきたので、 Homebrew に Pull request を送った。前回、コードを読んで何が原因なのかは把握していたので、修正すべきポイントもおおよそ見当がついていた。

当初は実行ファイルであればメタファイルではないという方針で Pull request を送ってみたが、パーミッションが正しく付与されていないものも稀にあるらしかった。そこで、コミッターのアドバイスを基にメタファイルは keg のルートディレクトリにしか存在しないだろうという前提で修正し、無事に merge された。

この修正によって、 `todo`, `changelog`, `license` といったメタファイルっぽい実行ファイルを配布したいときに `Empty installation` エラーによって失敗することはなくなった。また一つ、世界が便利になった。
