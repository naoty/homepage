---
title: Asset Pipelineでコントローラー・アクションごとにassetを管理する
time: 2013-07-18 13:46
tags: ['rails']
---

今更ながらAsset Pipelineでコントローラー・アクションごとにassetを管理する方法を調べた。

Assets PrecompileはすべてのJSやCSSがひとつのファイルにまとめてくれるので、通信量が減ったりキャッシュが効きやすくなったりメリットはあるけど、適切に管理しないと思わぬところに影響が出てしまうことがある。

いろいろ方法はありそうだけど、調べたなかでは以下のやり方がよさそうでした。他にいい方法があればコメントください。

# JavaScript

下記のとおり実装すると、おおまかに次のような流れで各コントローラー・アクション用のJSが実行されるはず。

1. bodyタグのdata属性にコントローラー名とアクション名が入る
2. グローバルオブジェクトに名前空間が用意される
3. 各コントローラーごとのオブジェクトが名前空間に用意される
4. JSがbodyタグのdata属性からコントローラー名とアクション名を取得する
5. 名前空間からコントローラー名に対応するJSオブジェクトを取得する
6. そのオブジェクトに定義された、アクション名に対応するメソッドを実行する

## 1. bodyタグのdata属性にコントローラー名とアクション名を挿入する

あとでJS側からコントローラー名とアクション名を取得するため、bodyタグのdata属性に入れておく。`controller_path`を使うと名前空間も含んだコントローラー名になる。

```rb:application.html.haml

%body{data: { controller: controller.controller_path, action: controller.action_name } }
  = yield
```

## 2. グローバルオブジェクトに名前空間を用意する

各コントローラー用のオブジェクトを管理するための名前空間をグローバルオブジェクトに用意しておく。`?=`は`null`または`undefined`であれば代入する意味。

```coffeescript:app/assets/javascripts/my_application.js.coffee

this.MyApplication ?= {}
```

## 3. 各コントローラー用のオブジェクトを用意する

各コントローラー用のオブジェクトを各JSファイルに定義して、先ほど用意した名前空間に登録しておく。オブジェクト内では下のようにアクション名に対応した関数を用意しておく。

```coffeescript:users.js.coffee

class UsersController
  index: ->
    console.log("UsersController#index")

  show: ->
    console.log("UsersController#show")

this.MyApplication.users = new UsersController
```

## 4. コントローラー名からオブジェクトを取得してフックを実行する

さっき作ったファイルを`application.js`で`require`したあとで、下のようなコードを書く。1.でbodyタグのdata属性に挿入しておいたコントローラー名とアクション名を取得する。で、そのコントローラー名に対応するJSのオブジェクトを名前空間から探し、見つかったらアクション名に対応するJSの関数を実行する。

```js:application.js

//= ...
//= require my_application
//= require_tree .

$(function () {
    var $body = $("body");
    var controller = $body.data("controller").replace(/\//, "_");
    var action = $body.data("action");

    var activeController = MyApplication[controller];

    if (activeController !== undefined) {
        if ($.isFunction(activeController[action])) {
            activeController[action]();
        }
    }
});
```

# CSS

## 1. bodyタグのクラスにコントローラー名とアクション名を使って名前空間を用意する

JSのときと同様に名前空間を含めたいので`controller_path`を使う。

```rb:application.html.haml

%body{class: css_namespace}
  = yield
```

```rb:application_helper.rb

def css_namespace
  controller_namespace = controller.controller_path.gsub(/\//) { "_" }
  "#{controller_namespace} #{controller.action_name}"
end
```

## 2. 名前空間ごとにCSSを定義する

sassやscssを使えば簡単に定義できる。

```sass:users.css.sass

.users
  // コントローラー全体のCSS

  &.index
    // 各アクションのCSS

  &.show
  &.new
```

---

## 参考

- [A Simple Pattern to Namespace and Selectively Execute Certain Bits of JavaScript Depending on Which Rails Controller and Action are Active - Jerod Santo](http://blog.jerodsanto.net/2012/02/a-simple-pattern-to-namespace-and-selectively-execute-certain-bits-of-javascript-depending-on-which-rails-controller-and-action-are-active/)
- [sass - How to manage CSS Stylesheet Assets in Rails 3.1? - Stack Overflow](http://stackoverflow.com/questions/6102158/how-to-manage-css-stylesheet-assets-in-rails-3-1)
