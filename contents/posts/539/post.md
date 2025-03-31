---
title: 開発環境のセットアップ 2024
time: 2024-03-10 10:32
tags: ['windows']
---

ゼロからWSL上に開発環境をセットアップしたくなったので、そのときのメモを残しておく。

# Ubuntuのリセット
1. 設定 > アプリ > インストールされているアプリ > Ubuntuを開いて「リセット」ボタンを押す
1. `wsl --unregister Ubuntu`
1. Ubuntuを起動すると、ターミナルが開いて初期化が始まる

# コマンド履歴

```bash
$ sudo apt update

# zshのセットアップ
$ sudo apt install -y zsh
$ sudo chsh -s /usr/bin/zsh naoty

# 1Passwordのssh agentを利用する
$ git config --global core.sshCommand ssh.exe
$ ssh.exe -T git@github.com # ウィンドウが出るので承認する

# asdfのインストール
$ git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.14.0
$ echo "source $HOME/.asdf/asdf.sh" > ~/.zshrc.local

# Node.jsのインストール
$ sudo apt install -y dirmngr gpg curl gawk
$ asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
$ asdf install nodejs latest
$ asdf global nodejs latest

# Rubyのインストール
$ sudo apt install -y autoconf patch build-essential rustc libssl-dev libyaml-dev libreadline6-dev zlib1g-dev libgmp-dev libncurses5-dev libffi-dev libgdbm6 libgdbm-dev libdb-dev uuid-dev
$ asdf plugin add ruby https://github.com/asdf-vm/asdf-ruby.git
$ asdf install ruby latest
$ asdf global ruby latest

# DartとFlutterのインストール
$ sudo apt install -y jq
$ asdf plugin add flutter
$ asdf install flutter latest
$ asdf global flutter latest

# ghqのインストール
$ sudo apt install -y unzip
$ asdf plugin add ghq
$ asdf install ghq latest
$ asdf global ghq latest
$ git config --global ghq.root "/home/naoty/repos"

# dotfiles
$ ghq get git@github.com:naoty/dotfiles.git
$ ln -s /home/naoty/repos/github.com/naoty/dotfiles/.zshrc
$ ln -s /home/naoty/repos/github.com/naoty/dotfiles/.vimrc
$ ln -s /home/naoty/repos/github.com/naoty/dotfiles/.vim
$ ln -s /home/naoty/repos/github.com/naoty/dotfiles/.tmux.conf
$ ln -s /home/naoty/repos/github.com/naoty/dotfiles/.tigrc

# fzf
$ sudo apt install -y fzf
$ ghq get git@github.com:naoty/fzf-functions.git
$ mkdir -p .zsh/functions
$ ln -s /home/naoty/repos/github.com/naoty/fzf-functions/history.zsh /home/naoty/.zsh/functions/
$ ln -s /home/naoty/repos/github.com/naoty/fzf-functions/git.zsh /home/naoty/.zsh/functions/
$ ln -s /home/naoty/repos/github.com/naoty/fzf-functions/ghq.zsh /home/naoty/.zsh/functions/
$ vim .zshrc.local # keybindを設定する

# Android Studio
$ sudo apt install -y clang cmake ninja-build pkg-config libgtk-3-dev
$ wget https://redirector.gvt1.com/edgedl/android/studio/ide-zips/2023.2.1.23/android-studio-2023.2.1.23-linux.tar.gz
$ android-studio/bin/studio.sh # ウィザードが開くのでセットアップを進めて、コマンドラインツールをインストールする
$ flutter doctor --android-licenses # ライセンスに許諾する
$ flutter doctor # Android Studioのセットアップが完了したことを確認する
```

- 各言語のバージョンマネージャーを使うのは面倒なので今回からasdfを使ってみた。すごい楽。
- 1passwordのssh-agentも初めて使ってみた。公式のドキュメント通りにポチポチしていたら動いた。これで安全に秘密鍵を保管できていい感じ。
- dotfilesやfzf用の関数は何年も変わらずに使い続けている。

---

# 追記: 2025-03-31
asdfがv0.16.0からGoによる実装に代わり、インストール方法も変更されたため追記しておく。

```bash
$ wget https://github.com/asdf-vm/asdf/releases/download/v0.16.7/asdf-v0.16.7-linux-amd64.tar.gz
$ tar -xf asdf-v0.16.7-linux-amd64.tar.gz
$ mv asdf $HOME/bin/
$ echo 'export PATH="${ASDF_DATA_DIR:-$HOME/.asdf}/shims:$PATH"' > ~/.zshrc.local
```
