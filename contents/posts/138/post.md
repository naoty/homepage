---
title: Rails開発環境 2012夏
time: 2012-08-08 10:14
tags: ['rails']
---

5月に「[Rails開発環境 2012初夏](http://naoty.hatenablog.com/entry/2012/05/20/032251)」という記事を公開してそこそこ好評だったので、最近導入してLife-Changingだったツールを「2012夏」バージョンとして紹介しようと思います。今回紹介するのは以下の3つです。

- pow + xip.io
- tmuxinator
- ctrlp.vim

### 1. pow + xip.io

pow + xip.ioによって同じネットワーク内にある、iPhoneやiPadのような他のデバイスからローカルサーバーに接続できるようになりました。これは、スマホ用サイトやアプリで使うAPIの開発で非常に重宝します。特に、実機でないと確認できないような場面では、pow + xip.ioがないと、ステージング環境にデプロイする必要が出てきて、非常に面倒です。

インストールは、[公式ページ](http://pow.cx/)にあるように以下のコマンドを入力するだけです。

```
$ curl get.pow.cx | sh
```

使い方としては、まず、Railsのプロジェクトルートへのシンボリックリンクを.powディレクトリに作ります。

```
$ cd ~/.pow
$ ln -s ~/workspace/rails/cui-aboutme
```

すると、これだけでローカルサーバーが起動して、[http://cui-aboutme.dev](http://cui-aboutme.dev)でアクセスできます。簡単ですねー。

```
$ open http://cui-aboutme.dev
```

同じLANにあるデバイスからは、プライベートIPアドレスを使ってアクセスすることができます。

```
$ ifconfig
...
        inet 192.168.1.4
...
```

ifconfig等で調べた結果、上のようになった場合、[http://cui-aboutme.192.168.1.4.xip.io](http://cui-aboutme.192.168.1.4.xip.io)で他のデバイスからもアクセスできます。

![f:id:naoty_k:20120808013751j:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20120808/20120808013751.jpg "f:id:naoty\_k:20120808013751j:plain")

注意点としては、Lionでは「システム環境設定」→「共有」→「Web共有」を有効にしておく必要があります。これがオフになっててハマりました…＞＜ちなみに、Mountain Lionでは「Web共有」の項目がなくなっていますが、手元では無事に成功しています。

実際にプロジェクトで使っていく中でのTipsをいくつかご紹介します。

#### powder

powderはpowの操作をカンタンに行うためのコマンドラインツールです。Gemfileからインストールします。

```
# Gemfile

group :development do
  gem 'powder'
end
```

シンボリックリンクを.powに作る操作や、サーバーを再起動する操作などをカンタンなコマンドで実行できます。

```
$ powder link
$ powder restart
```

詳細は[公式ページ](https://github.com/rodreegez/powder)を参照してください。

#### pry-remote

pryを使っている方は多いと思いますが、powのサーバーはrails sで起動するわけではないので、普通のやり方ではpryを使うことができません。そこで活躍するのが、pry-remoteです。これもGemfileからインストールします。

```
# Gemfile

group :development, :test do
  gem 'pry-rails'
  gem 'pry-remote'
end
```

使い方は、いつものbinding.pryの代わりにbinding.pry\_remoteとコードに追加して、実行すると処理が止まります（見た目には分かりにくいけど…）。そこで、

```
$ pry-remote
```

と打つと、いつものpryコンソールに入れます。

ちょっと分かりにくいかもしれませんが、[公式ページ](https://github.com/Mon-Ouie/pry-remote)も見てもらって実際に使うと雰囲気がわかるとおもいます。

### 2. tmuxinator

tmuxinatorは、tmuxで起動するセッションをあらかじめ定義しておいて、コマンド一発で開発環境を起動することができるツールです。gemで配布されているので、bundlerでインストールします。[公式ページ](https://github.com/aziz/tmuxinator/)にしたがって準備します。

```
$ gem install tmuxinator
$ echo "[[-s $HOME/.tmuxinator/scripts/tmuxinator]] && source $HOME/.tmuxinator/scripts/tmuxinator" >> .zshrc
$ source .zshrc
```

使い方としては、mux new [project name]でテンプレートを作って、起動するセッションを定義していきます。

```
$ mux new cui-aboutme
```

```
# .tmuxinator/cui-aboutme.yml

project_name: cui-aboutme
project_root: ~/workspace/rails/cui-aboutme
tabs:
  - main:
      layout: tiled
      panes:
        - git fetch --prune && git status --short --branch
        - curl http://cui-about.me/users
        - tig
  - vim: vi
  - app:
      layout: even-horizontal
      panes:
        - rails c
        - tail -f log/development.log
  - test: guard
```

- 各項目で、起動時に実行するコマンドを定義しています。
- tabsで起動するタブ毎の設定を定義します。上の設定例だと、「main」「vim」「app」「test」の4つのタブを起動します。
- panesでタブ内で分割するペインを定義し、layoutでペインの配置を定義します。上の設定例だと、「main」タブに「git fetch等gitの操作」「curl等シェルの操作」「tigでコミットログのビューワー」の3つのペインを起動します。

その他、いろいろな設定ができるようなので詳しくは[公式ページ](https://github.com/aziz/tmuxinator/)をご覧ください。

### 3. ctrlp.vim

ctrlp.vimは、Ctrl-pで起動するファイラーです。unite.vimと近いのかもしれませんが、僕はこっちの方がサクサクしてて操作もわかりやすくて好きです。下はスクリーンショットです。

![f:id:naoty_k:20120808095402j:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20120808/20120808095402.jpg "f:id:naoty\_k:20120808095402j:plain") ![f:id:naoty_k:20120808100021j:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20120808/20120808100021.jpg "f:id:naoty\_k:20120808100021j:plain")

.vimrcで以下のように設定しました。

```
" .vimrc

Bundle 'kien/ctrlp.vim'

let g:ctrlp_cmd = 'CtrlPMixed'
let g:working_path_mode = 'rc'
let g:custom_ignore = {
  ¥ 'dir': '¥.git¥|vendor/bundle¥|tmp',
  ¥ 'file': '¥.jpg$¥|¥.jpeg$¥|¥.png$¥|¥.gif$¥|¥.log'
  ¥ }
```

- Ctrl-pで起動するモードを file + mru + bufferを同時に検索するMixedにしています。これで「現在のディレクトリ以下」「よく使うファイル」「バッファ」の中から検索します。
- 'rc'モードにすることで、.gitがあるディレクトリを優先するみたいです。
- vendor/bundleやtmpといったディレクトリや\*.logのような大きいファイルを無視することで、起動をスムーズにしています。

その他いろいろ設定があるようなので、ヘルプや[公式ページ](https://github.com/kien/ctrlp.vim/)をご覧ください。
