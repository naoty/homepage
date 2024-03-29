---
title: vim も zsh も捨てた
time: 2017-04-18 22:46
tags: ['vim']
---

プロジェクト移行期に入って暇な時間ができたので、開発環境をリフレッシュすることにした。vim や zsh の設定が少しずつ壊れてきていたのだった。

.vimrc や .zshrc を眺めてみると、かつて ~~意識が高かった頃に~~ 施した設定が何のためのものだったのか忘れてしまっていた。別人が書いたスパゲティコードのようだった。

また vim や zsh の設定を検索して理解するべきなんだろうか。ここで覚えた知識はまたすぐに忘れてしまうんじゃないだろうか。設定が洗練されるほどに、それを更新する機会もまた少なくなってくる。設定が必要になるきっかけは忘れた頃にやってくるもんだ。

やり方を根本的に見直す時期なのかもしれない。新しいツールもいまなら選択できる。

まず、vim から atom に移行した。git のコミットメッセージやちょっとしたファイルの修正ではまだ vim を使うものの、細かい設定が必要になる作業では vim を使うのをやめた。デフォルトでインストールされているプラグインのおかげで、開発環境に合ったプラグインをインストールだけで充分に使えるものになった。

プラガブルな作りになっているから、プラグインのインストール・アンインストールだけで設定が完結してしまう。もしプラグインが壊れたら、替わりをインストールすればいい。解決すべき問題は局所化されているから、なんとか自作することも可能だろう。

次に、zsh から fish に移行した。fish は設定しなくてもコマンドの補完などの設定がデフォルトでいい感じになっていて、ほとんど設定がいらなかった。しかも、設定ファイルも何種類もあるのではなくて、1つのファイルだけでいいようだ。

fish 自体にはプラガブルな機構がないので、[fisherman](https://github.com/fisherman/fisherman) というツールを併用している。fisherman によってプラグインのインストール・アンインストール、依存関係の管理が可能になった。

自分でいくつかプラグインをつくった。

- [naoty/fish-my\_prompt](https://github.com/naoty/fish-my_prompt) : 自分好みのプロンプトが見当たらなかったので自作した。
- [naoty/fish-my\_key\_bindings](https://github.com/naoty/fish-my_key_bindings) : キーバインディングも関数として定義できるためプラグイン化した。これによって、インストール・アンインストールだけで設定を変更できる。
- [naoty/fish-my\_peco\_functions](https://github.com/naoty/fish-my_peco_functions) : 以前から peco を使っていたため、peco と組み合わせて使う関数群をプラグイン化した。

結局、設定ファイルがプラグインという形に変わっただけではとも思ったが、一度壊れたプラグインはおそらくもう修正することはないだろう。アンインストールして、新たに必要なプラグインを見繕うことになる。ダメになったら捨てればいい、みたいな気軽さがある。

* * *

## 追記（2017-04-20）

思っていた以上に反響があって驚いた。修正点と反響へのコメントを載せます。

- 「意識が高かった頃に施した」という表現を撤回しました。意識が高いとか低いとか不毛な話を避けたかったので。
- vim と zsh だけじゃなく tmux も捨てました。サーバー内で作業するなら必要かもしれないけど、普段の開発では主にウィンドウ分割の用途としてのみ使っており、iTerm 2 の機能だけで十分ではということに気づきました。
- デフォルトのままが良いという話について。僕は普段は iOS アプリの開発が主な仕事なので、シェルスクリプトに触れる機会はあんまりありません。サーバーにログインして何か作業するような仕事がメインであれば、bash をデフォルト設定で使ったり、ちゃんとシェルスクリプトを理解することは必要だと思います。あくまでここに書いたのは僕の場合なので、そこを考慮してくれると誤解がないかなと思います。
- Git で設定ファイル群、俗にいう dotfiles を管理すれば良いという話について。僕もかなり昔から [dotfiles](https://github.com/naoty/dotfiles) を GitHub で公開しており、かつてはちゃんとメンテナンスしていました。やらなくなった理由としては、細かいチューニングの度にコミットするのがめんどくさくなったということがありますね。あとは、直接設定ファイルを修正することが減ってきているというのもあります。atom の設定画面でポチポチ設定を修正すると、それをコミットするのを忘れてしまうのです。こうして大きい差分が生まれてしまい、メンテナンスをする意欲が失われていきました。
