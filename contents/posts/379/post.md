---
title: bundle lockが便利
time: 2019-08-21T23:24:00+0900
tags: ["ruby"]
---

`bundle lock`というコマンドがあることに気づいた。これはgemをインストールせずに`Gemfile.lock`だけを更新する。

```bash
% bundle lock
Fetching gem metadata from https://rubygems.org/.
Resolving dependencies...
Writing lockfile to Gemfile.lock
```

普段、MySQLのDockerイメージを使っているので、`mysql2`をインストールしようとすると以下のようなエラーになる。

```bash
mysql client is missing. You may need to 'brew install mysql' or 'port install mysql', and try again.
```

このままだと`Gemfile.lock`を更新できないので、Dockerイメージ内で`bundle install`して`Gemfile.lock`の同期によってホスト側を更新していた。

`bundle lock`を使うともっと簡単にできることがわかった。インストールせずに`Gemfile.lock`を更新するので、ホストにMySQLがなくてもいい。便利。
