---
title: tmuxinatorで一瞬で開発環境を起動する
time: 2012-07-21 16:57
---

前回は[dr6kaiz](http://qiita.com/users/d6rkaiz)さんの[pow + rbenvで手軽なRack環境構築](http://qiita.com/items/0f0b15b800fcd8a742f9)でした。

今回は[tmuxinator](https://github.com/aziz/tmuxinator/)を使って、コマンド一発で開発環境を起動する話をします。

## tmuxinator とは
tmuxinatorとは、tmuxで起動するセッションを予め定義しておき、コマンド一発でそのセッションを起動できるようにしたものです。ちなみに、screenで同じことをする[screeninator](https://github.com/jondruse/screeninator)というツールもあります。こちらが先に開発されたようです。

## インストール

```sh
$ cd
$ gem install tmuxinator
$ echo "[[ -s $HOME/.tmuxinator/scripts/tmuxinator ]] && source $HOME/.tmuxinator/scripts/tmuxinator" >> .zshrc
$ source .zshrc
$ echo $EDITOR
/usr/bin/vi
$ echo $SHELL
/bin/zsh
```

- tmuxinatorはgemで提供されているので、`gem install`します。
- その後、補完スクリプトを`.zshrc`や`.bashrc`に追加して読み込みます。
- tmuxinatorは環境変数`$EDITOR`と`$SHELL`を使うそうなので、確認しておきます。

## 設定

```sh
$ mux new cui-aboutme
```

- `tmuxinator`とそのaliasの`mux`というコマンドが用意されています。
- `mux new [project name]`でプロジェクトの設定ファイルを作成します。
- このコマンドを実行すると、`$EDITOR`で設定されたエディタで以下のような設定ファイルが開きます。

```yml:~/.tmuxinator/cui-about.yml
# ~/.tmuxinator/sample.yml
# you can make as many tabs as you wish...

project_name: Tmuxinator
project_root: ~/code/rails_project
socket_name: foo # Not needed.  Remove to use default socket
rvm: 1.9.2@rails_project
pre: sudo /etc/rc.d/mysqld start
tabs:
  - editor:
      layout: main-vertical
      panes:
        - vim
        - #empty, will just run plain bash
        - top
  - shell: git pull
  - database: rails db
  - server: rails s
  - logs: tail -f logs/development.log
  - console: rails c
  - capistrano:
  - server: ssh me@myhost
```

- `rvm`で利用するrubyのバージョンを指定したり、`pre`でセッション起動時に実行するコマンドを指定できたりします。
- `tabs`でセッション内で起動するウィンドウを定義します。この初期設定だと、8つウィンドウを起動します。
- `tabs`内では、`editor`や`shell`といったキーがウィンドウ名を表し、値がそのウィンドウが起動したときに実行されるコマンドとなります。この初期設定だと、セッション起動と同時に8つのウィンドウが起動して、自動的に`git pull`したり`rails s`したり`ssh`したりします。
- `layout`と`panes`で、そのウィンドウ内のペインとその配置を定義します。`editor`を例にとると、ウィンドウ内に`vim`のペインと何もしないペインと`top`のペインが`main-vertical`で表示されます。

## 起動

```sh
$ mux cui-aboutme
```

- このコマンド一発で、上記で設定したセッションを起動します。
- 起動と同時に設定されたコマンドも自動で実行されます。

## カスタマイズ例

```yml:~/.tmuxinator/cui-aboutme.yml
# ~/.tmuxinator/sample.yml
# you can make as many tabs as you wish...

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
        - powder log
  - test: guard
```

- 僕の場合は「tigを中心としたgitの作業をするウィンドウ」「エディタのウィンドウ」「コンソールやログをみるウィンドウ」「自動テストを行うウィンドウ」の4つを一度に起動できるようにしてます。
- あと、起動時に`git fetch`でリポジトリの更新を確認したり、`guard`で自動テストを開始したりしてます。

## tips

- 一度に同時に起動するウィンドウを一度にすべて閉じるための設定

```.tmux.conf
bind-keys C-b kill-session
```

- 複数のプロジェクトに共通する設定は`~/.tmuxinator/default.yml`で設定できます。

## おまけ

- テキストベースの自己紹介サービス[cui-about.me](http://cui-about.me)やってます。よかったらどうぞ。
