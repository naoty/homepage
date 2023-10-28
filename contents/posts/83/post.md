---
title: centosにgitosisを入れてpushするまでのメモ
time: 2011-10-15 01:41
tags: ['git']
---

１．gitosisをyumでインストール

```
remote$ sudo yum install gitosis
```

- 標準リポジトリにはないと思うので、僕の場合はepelリポジトリを追加しました。
- いっしょにgitとかもインストールされる

２．gitというユーザーを追加

```
remote$ sudo useradd git
```

３．gitosisの初期化

```
remote$ sudo -H -u git gitosis-init < id_dsa.pub
```

４．ローカルでgit clone

```
local$ git clone ssh://git@ホスト名:ポート番号/gitosis-admin.git
```

５．pushしたいリポジトリを設定

```
local$ cd gitosis-admin.git
local$ vi gitosis.conf
```

```
[gitosis]

[group gitosis-admin]
writable = gitosis-admin
members = naoty

[group hoge]
writable = hoge
members = naoty
```

```
local$ git add .
local$ git commit -m 'hogeリポジトリを追加'
local$ git push
```

６．プロジェクトの変更をpushする場合

```
local$ cd
local$ cd workspace/hoge
local$ git remote add origin ssh://git@ホスト名:ポート番号/hoge.git
local$ git push origin master
```
