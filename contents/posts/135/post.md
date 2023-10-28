---
title: Railsデフォルトのjqueryは圧縮されてない
time: 2012-07-21 01:14
tags: ['rails']
---

## 注記（7/21追記）

- production環境ではassets precompileによって圧縮されるため、下記の設定は不要です。
- assets pipelineを理解する上での参考程度にしてもらえればと思います。

---

```js:app/assets/javascripts/application.js
//= require jquery
//= require jquery_ujs
//= require_tree .
```

```sh
[1] pry(main)> puts Rails.application.config.assets.paths
/Users/naoty/workspace/sample/app/assets/images
/Users/naoty/workspace/sample/app/assets/javascripts
/Users/naoty/workspace/sample/app/assets/stylesheets
/Users/naoty/workspace/sample/vendor/assets/javascripts
/Users/naoty/workspace/sample/vendor/assets/stylesheets
/Users/naoty/workspace/sample/vendor/bundle/ruby/1.9.1/gems/jquery-rails-1.0.14/vendor/assets/javascripts
```

- `rails new`で生成されるapplication.jsでロードするjqueryは、上記のコマンドで確認できる通り、`jquery-rails`というgemに同梱されている`jquery.js`。ちなみに現時点では最新のv1.7.2。
- なので、圧縮されてないものがデフォルトではロードされてしまう。これは、けっこう気づきにくい罠だと思う。

```sh
$ cd `bundle show jquery-rails`
$ tree vendor/
vendor/
└── assets
    └── javascripts
        ├── jquery-ui.js
        ├── jquery-ui.min.js
        ├── jquery.js
        ├── jquery.min.js
        └── jquery_ujs.js
```

- `jquery-rails`の中を見てみると、`jquery.min.js`がある。
- 圧縮版あるんだから、こっち使う。
- `jquery-ui.min`もあるから、jquery-ui使う場合も同じ。まあ、jquery-uiは必要なコンポーネントだけに絞るべきなので、`jquery-rails`内のjquery-uiは使うことないと思う。

```js:app/assets/javascripts/application.js
//= require jquery.min
//= require jquery_ujs
//= require_tree .
```

- これで圧縮版のjqueryをロードする。
