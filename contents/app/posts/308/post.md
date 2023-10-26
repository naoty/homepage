---
title: GitHub Pagesの更新をCIで自動化した
time: 2017-12-08T00:04:00+0900
description: GitHub Pagesのための更新作業を手作業からCircleCIに変更した。
tags: ["meta"]
---

GitHub Pagesの管理が煩雑だったため、Circle CIで自動化した。

これまでは[GitHub Pagesのリポジトリ](https://github.com/naoty/naoty.github.io)を[管理リポジトリ](https://github.com/naoty/homepage)のサブモジュールとして管理していたが、サブモジュールはいろいろと作業が面倒だった。サブモジュールと本体の両方をgitでコミットするのがとにかく面倒だった。

最近、仕事でCircle CI 2.0の対応をしているため、このブログの更新もCIに任せることができそうだと思い、さっそく設定をした。以下、ハマったところとか工夫したところとか。

* GitHub pagesのリポジトリをcloneする必要があったが、その際にSSH接続で`Are you sure you want to continue connecting (yes/no)?`と聞かれてしまい、ビルドが止まってしまった。そこで、以下のようにすることで回避した。

```yaml
- run:
    name: SSH settings
    command: mkdir ~/.ssh/ && echo -e "Host github.com\n\tStrictHostKeyChecking no\n" > ~/.ssh/config
```

* Circle CIで他のリポジトリにアクセスするには鍵を追加する必要があるため、設定画面から鍵を追加した。
* Circle CI上でgit commitする際に`username/repo@commit_id`の記法をメッセージに追加することで、GitHub pagesのコミットメッセージから対応する管理リポジトリのコミットに辿れるようにした。

config.ymlは今のところ以下のようになっている。`npm install`でキャッシュを使っていないけど、そこらへんは徐々に最適化していきたい。

```yaml
version: 2
jobs:
  build:
    docker:
      - image: circleci/node
    steps:
      - run:
          name: SSH settings
          command: mkdir ~/.ssh/ && echo -e "Host github.com\n\tStrictHostKeyChecking no\n" > ~/.ssh/config
      - run:
          name: Clone GitHub pages
          command: |
            git clone git@github.com:naoty/naoty.github.io.git .
            git config user.email "naoty.k@gmail.com"
            git config user.name "Naoto Kaneko"
          working_directory: ~/naoty.github.io
      - checkout
      - run: npm install
      - run: npm run build
      - run:
          name: Publish GitHub pages
          command: |
            cp -pr public/* ~/naoty.github.io/
            cd ~/naoty.github.io
            git add .
            git commit -m "Publish naoty/homepage@${CIRCLE_SHA1}"
            git push origin master
```
