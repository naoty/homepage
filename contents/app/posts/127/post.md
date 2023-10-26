---
title: 開発環境用Procfile
time: 2012-06-09 13:07
tags: ['rails']
---

- Herokuでwebrickじゃなくてthinを使いたい
- 開発環境ではforemanでguardを起動したい。.envで必要な環境変数をロードしたいので。
- でもHerokuではguardはいらない。

という理由から、production環境用Procfileとdevelopment環境用Procfileを分けたいと思ったので、以下のようにしてみた。

```ruby:Procfile
web: rails s thin -p $PORT
```

```ruby:Procfile.development
web: rails s thin
guard: guard
```

```ruby:.foreman
procfile: Procfile.development
```

```sh:.gitignore
.foreman
```

- .foremanはforemanコマンドのデフォルトオプションを指定できる。
- procfileオプションで実行するProcfileを指定できる。
- .foremanファイルを.gitignoreに追加してHerokuで実行しないようにする。
