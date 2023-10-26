---
title: さくらVPS作業メモ（rubyインストールまで）
time: 2012-01-03 00:14
tags: ['ruby']
---

環境

- さくらVPS 512
- CentOS
- naoty@local：ローカルの作業用ユーザー
- root@sakura：さくらVPSのroot
- naoty@sakura：さくらVPSの作業用ユーザー
- 使いまわしてる設定ファイル：[https://github.com/naoty/dotfiles](https://github.com/naoty/dotfiles) ブランチはserver

sshでrootにログイン

```
naoty@local% ssh-keygen -R xxx.xxx.xxx.xxx
naoty@local% ssh root@xxx.xxx.xxx.xxx
```

作業用ユーザーの作成

```
root@sakura% useradd naoty
root@sakura% passwd naoty
```

su, sudoをwheelのみに限定

```
root@sakura% usermod -G wheel naoty
root@sakura% visudo
root@sakura% vi /etc/login.defs
root@sakura% exit
```

公開鍵でのログインに変更

```
naoty@local% scp .ssh/id_rsa.pub naoty@xxx.xxx.xxx.xxx:~
naoty@local% ssh naoty@xxx.xxx.xxx.xxx
naoty@sakura% mkdir .ssh
naoty@sakura% chmod 700 .ssh
naoty@sakura% mv id_rsa.pub .ssh/authorized_keys
naoty@sakura% chmod 600 .ssh/authorized_keys
naoty@sakura% sudo vi /etc/ssh/sshd_config
naoty@sakura% sudo /etc/init.d/sshd restart
naoty@sakura% exit
naoty@local% ssh sakura
```

yumでgit, zsh, vimをインストール

```
naoty@sakura% sudo yum -y update
naoty@sakura% sudo rpm -ivh http://repo.webtatic.com/yum/centos/5/latest.rpm
naoty@sakura% sudo yum -y --enablerepo=webtatic install git zsh vim-enhanced
```

使い回してる設定ファイルを適用

```
naoty@sakura% ssh-keygen -t rsa
naoty@sakura% cat .ssh/id_rsa.pub
# githubにsakuraの公開鍵を設定
naoty@sakura% git clone git@github.com:naoty/dotfiles.git
naoty@sakura% cd dotfiles
naoty@sakura% git checkout server
naoty@sakura% cd
naoty@sakura% ln -s dotfiles/.gitconfig ~/.gitconfig
naoty@sakura% ln -s dotfiles/.gitignore_global ~/.gitignore_global
naoty@sakura% ln -s dotfiles/.vimrc ~/.vimrc
naoty@sakura% mkdir -p .vim/colors
naoty@sakura% exit
naoty@local% scp -P sshd .vim/colors/railscasts.vim naoty@xxx.xxx.xxx.xxx:.vim/colors/
```

パスを通す

```
naoty@local% ssh sakura
naoty@sakura% vi .bash_profile
naoty@sakura% source .bash_profile
```

iptablesの設定（とりあえずsshと内部からのコネクションのみ）

```
naoty@sakura% sudo iptables -A INPUT -p tcp --dport sshd -j ACCEPT
naoty@sakura% sudo iptables -A INPUT -m state --state ESTABLISHED -j ACCEPT
naoty@sakura% sudo iptables -P INPUT DROP
naoty@sakura% sudo /etc/init.d/iptables save
naoty@sakura% sudo /etc/init.d/iptables restart
```

rvmのインストール

```
naoty@sakura% cp /etc/pki/tls/certs/ca-bundle.crt .
naoty@sakura% sudo curl http://curl.haxx.se/ca/cacert.pem -o /etc/pki/tls/certs/ca-bundle.crt
naoty@sakura% sudo bash -s stable < curl -s https://raw.github.com/wayneeseguin/rvm/master/binscripts/rvm-installer )
naoty@sakura% su -
root@sakura% usermod -G wheel,rvm naoty
root@sakura% exit
naoty@sakura% exit
naoty@local% ssh sakura
```

rubyのインストール

```
naoty@sakura% sudo yum install -y gcc-c++ patch readline readline-devel zlib zlib-devel libyaml-devel libffi-devel openssl-devel make bzip2 autoconf automake libtool bison
naoty@sakura% rvm install 1.9.3
naoty@sakura% rvm use 1.9.3 --default
```
