---
title: Goでちょっとしたツールを作った
time: 2017-09-16 18:49
tags: ['oss']
---

Go言語のレベルアップを目的としてちょっとしたツールを2つ作った。

## license

[naoty/license](https://github.com/naoty/license)

MITライセンスファイル（`LICENSE`）を作成するとき、いつも[MIT License | Choose a License](https://choosealicense.com/licenses/mit/)からコピペしていた。さすがに毎回同じことをするのは面倒になってきたのでテンプレートからテキストを生成するだけのコマンドラインツールを書いた。`text/template`を使ったことがなかったのでちょうどいい練習になった。

## brewery

[naoty/brewery](https://github.com/naoty/brewery)

Goで書いたコマンドラインツールは[naoty/homebrew-misc](https://github.com/naoty/homebrew-misc)からHomebrewでインストールできるようにしている。その準備をするためにformulaを作るとき、`brew create <url> --tap naoty/misc`を実行していた。しかし、この方法だと`/usr/local/Homebrew/Library/Taps/naoty/homebrew-misc/`以下にformulaが作成されてしまい、その後ワークスペースにコピペする作業が発生していた。

そこで、formulaをテンプレートから生成して標準出力に出力するだけのコマンドラインツールを作った。SHA256もちゃんと計算してくれるので便利。今後はformulaを書く作業が捗りそう。

## 学び

- `text/template`の使い方。Webアプリケーションを開発するのであれば、同じようなパッケージである`html/template`が確実に必要になるので、覚えておきたかった。
- [https://github.com/jteeuwen/go-bindata](https://github.com/jteeuwen/go-bindata)によってテンプレートをバイナリに含めること。これもテンプレートを使う以上シングルバイナリにして配布を簡単にするために必要になるだろう。
- golang/depの使い方。おおかたの仕様についてはstableになったとのことなので、今から使い方に慣れておきたい。`dep ensure`のバリエーションと`Gopkg.toml`の書き方をもう少し把握したい。
