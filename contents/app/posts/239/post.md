---
title: pod installしたら自動的にghq getする
time: 2014-10-22 18:18
---

[naoty/cocoapods-src](https://github.com/naoty/cocoapods-src)を使う。

```bash
$ gem install coocapods
$ gem install cocoapods-src
```

```yaml:~/.cocoapods/.podrc
cocoapods-src_use_ghq: true
```

`pod install`するとインストールしたライブラリのソースコードを自動的に`ghq get`してくれる。
