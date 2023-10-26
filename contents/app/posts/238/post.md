---
title: pod installしたらgit cloneしてくれるヤツ書いた
time: 2014-10-20 00:15
tags: ['oss']
---

[ghqを使ったローカルリポジトリの統一的・効率的な管理について - delirious thoughts](http://blog.kentarok.org/entry/2014/06/03/135300)を拝見して良さそうだったので、iOS開発にも持ち込むためCocoaPodsのプラグインを書いた。20行くらいしか書いてないし、ghqとの連携もまだ実装できてないけど、取り急ぎ。

[naoty/cocoapods-src · GitHub](https://github.com/naoty/cocoapods-src)

## 使い方

```
$ gem install cocoapods-src
```

cocoapodsは入っている前提で、cocoapods-srcをインストールする。

```
$ pod install
```

インストールすると、あとは`pod install`すれば勝手にpodsを`git clone`してくれる。今のところ`~/.cocoapods/src/`に以下のような感じでダウンロードされる。

```
$ tree ~/.cocoapods/src -I .git -L 2
.cocoapods/src
├── .DS_Store
├── AFNetworking
│   ├── .cocoadocs.yml
│   ├── .gitignore
│   ├── .travis.yml
│   ├── AFNetworking
│   ├── AFNetworking.podspec
│   ├── AFNetworking.xcworkspace
│   ├── CHANGES
│   ├── CONTRIBUTING.md
│   ├── Example
│   ├── LICENSE
│   ├── README.md
│   ├── Rakefile
│   ├── Tests
│   └── UIKit+AFNetworking
```

## 今後

- ghq連携
- git以外のVCSのサポート

## 追記（10/22）

0.2.0にアップデートして、ghqと連携できるようになった。

`~/.podrc`、`~/.cocoapods/.podrc`、`./.podrc`のいずれかに以下のような設定を書くと`git clone`の代わりにghqを使ってダウンロードする。

```
cocoapods-src_use_ghq: true
```
