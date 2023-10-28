---
title: node.js環境構築
time: 2012-12-16 23:33
tags: ['nodejs']
---

websocketを使ったリアルタイムなアプリケーションを作りたくなったので、node.jsを始めようと思った。とりあえず、いろいろ必要なものをインストールしたので、それをメモに残しておく。

## nodebrew

```
$ curl https://raw.github.com/hokaccha/nodebrew/master/nodebrew | perl - setup
$ vi .zprofile
export PATH=$HOME/.nodebrew/current/bin:$PATH
$ source .zprofile
```

- node.jsはバージョンがどんどん更新されるようなので、Homebrewではなくパッケージマネージャーでインストールする。
- 他にもnvmやnaveというものがあるらしいが、zshとの相性がよくないという話なので、[nodebrew](https://github.com/hokaccha/nodebrew)を選択した。

## node.js & npm

```
$ nodebrew install stable
$ nodebrew use stable
$ node -v
v0.8.16
$ npm -v
1.1.69
```

- nodebrewを使ってnode.jsとnpmをインストールする。

## bower

```
$ npm install bower -g
```

- [bower](http://twitter.github.com/bower/)はTwitter謹製のクライアントサイドのライブラリに特化したパッケージマネージャー。
- jQuery, underscore.js, bootstrapなどのリソースをpackage.jsonと同じようにプロジェクト毎にインストールできるのが便利。
- Railsだとjquery-railsなどgemのなかにそれらのリソースが含まれることもあるけど、node.jsはそういうのなさそうなので、重宝しそう。

### 例

例として、いま見てた本のサンプルプロジェクトで扱うリソースをbowerで管理してみる。

```
// component.json

{
  "name": "fileupload",
  "version": "0.0.1",
  "main": "./public/stylesheets/style.css",
  "dependencies": {
    "jquery": "*",
    "jquery-ui": "*",
    "jquery-file-upload": "*",
    "jquery-masonry": "*",
    "fancybox": "*"
  }
}
```

これで`bower install`とすればインストール完了。

## NoSQL

```
$ brew install couchdb
$ mkdir -p ~/Library/LaunchAgents
$ cp /usr/local/Cellar/couchdb/1.2.0/Library/LaunchDaemons/org.apache.couchdb.plist ~/Library/LaunchAgents/
$ launchctl load -w ~/Library/LaunchAgents/org.apache.couchdb.plist
```

- MongoDB, Redis, CouchDBなどのNoSQLはbrewでインストールするだけ。
- インストール後に表示されるメッセージに従って、自動起動ファイルをロードしておくことも忘れずに。

* * *

### 追記（2012/12/22）

### node.jsでbowerを使うには

```
$ tree -I node_modules
.
├── app.js
├── package.json
├── public
│ ├── component.json // <- ここに配置
│ ├── components // <- ここにインストールされる
│   ├── images
│   ├── javascripts
│   └── stylesheets
│   └── style.css
├── routes
│   └── index.js
└── views
    ├── layout.jade
    └── index.jade
$ cd public
$ bower install
```

`bower install`でインストールされるライブラリは同じディレクトリ内のcomponentsというディレクトリに入る。なので、public内にcomponent.jsonを配置して`bower install`すればよさげ。

### node-dev

```
$ npm install node-dev -g
$ node-dev app.js
```

`node app.js`で起動すると、ファイルを変更するたびに再起動する必要がありめんどくさい。node-devを使うとその必要がなくなるので、とても便利。インストール必須だと思う。
