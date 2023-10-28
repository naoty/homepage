---
title: CocoaPodsにコントリビュートした
time: 2016-08-14 10:00
tags: ['oss']
---

[Add a license type to generated acknowledgements file in plist by naoty · Pull Request #5436 · CocoaPods/CocoaPods](https://github.com/CocoaPods/CocoaPods/pull/5436)

開発中のiOSアプリでCocoaPodsでインストールしたライブラリのライセンス表示を実装する際に、とある理由でライセンスに表示したくない状況があった。いろいろ調べたところ、CocoaPodsが出力する`Pods-{ProjectName}-Acknowledgements.plist`に`MIT`といったライセンスタイプが含まれていないことがわかった（ライセンスのテキストはあるけど、そこから抽出するのは大変）。podspecにはライセンスタイプを記載する必要があるため、内部表現としてライセンスタイプをもっているはずだと思った。そこで、それをplistファイルに出力するようにするPull requestを送って、そしてmergeされた。

Pull requestしてみた感想としては、RSpecのようなよく知らないテスティングフレームワークを使っており、自力ではどこをテストすればいいのか分からず困惑した。コミッターの方が修正してくれたようなのでよかった。

`1.1.0.beta.1`に含まれているので、今後は`MIT`などライセンスタイプを基に表示するライブラリをフィルタリングできたりできると思う。よかったら利用してください。
