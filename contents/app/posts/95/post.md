---
title: dotfilesをgithubで管理する
time: 2011-12-29 10:32
---

例えば、家PCとオフィスPCで.vimrcと.zshrcを共有したいとします。

（例：家PC）  
１．dotfilesというディレクトリを用意

```
naoty@home% cd
naoty@home% mkdir dotfiles
```

２．git init

```
naoty@home% cd dotfiles
naoty@home% git init
```

３．.vimrcや.zshrcなどをdotfilesに移動

```
naoty@home% mv ~/.vimrc dotfiles/
naoty@home% mv ~/.zshrc dotfiles/
```

４．HOMEにシンボリックリンクを作成する

```
naoty@home% ln -s .vimrc ~/.vimrc
naoty@home% ln -s .zshrc ~/.zshrc
```

５．addしてcommit

```
naoty@home% git add .
naoty@home% git commit -m '.vimrcと.zshrcを追加'
```

６．githubにpush

```
naoty@home% git remote add github git@github.com:naoty:dotfiles.git
naoty@home% git push github master
```

（例：オフィスPC）  
７．githubからdotfilesをcloneしてくる

```
naoty@office% cd
naoty@office% git clone git@github.com:naoty:dotfiles.git
```

８．HOMEにシンボリックリンクを作成する

```
naoty@office% ln -s dotfiles/.vimrc ~/.vimrc
naoty@office% ln -s dotfiles/.zshrc ~/.zshrc
naoty@office% source .zshrc
```

９．オフィス用の設定のためにブランチを作成

```
naoty@office% cd dotfiles
naoty@office% git checkout -b office
```

※共通する設定はmasterブランチで管理
