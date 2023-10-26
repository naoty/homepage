---
title: カスタムディレクティブでAPIから受け取ったデータを表示する
time: 2014-06-12 13:29
tags: ['angular']
---


APIから受け取ったデータを表示するカスタムディレクティブを作る場合、`$watch`でscopeのプロパティを監視し再描画を行うといった実装が必要になる。

```html:index.html
<div ng-controller="MyController">
  <my-directive data="users"></my-directive>
</div>
```

- `my-directive`というディレクティブを作る。表示したいデータを参照するscopeのプロパティを`data`属性に指定する。

```coffeescript:my_controller.coffee
window.ngApp.controller "MyController" ["$scope", "User", ($scope, User) ->
  $scope.users = User.query()
]
```

- APIから受け取ったデータを`users`というプロパティで参照する。このとき、APIからデータを受け取るのを待たずに空の参照が渡される。非同期に返ってきたデータはこの参照に追加される。

```coffeescript:my_directive.coffee
window.ngApp.directive "myDirective", ->
  restrict: "E"
  link: (scope, elements, attrs) ->
    render = (data) ->
      # 描画処理
    scope.$watch(attrs.data, ((newData, oldData) -> render(newData)), true)
```

- `scope.$watch`でscopeのプロパティや、scopeのコンテキストで評価した式の結果を監視する。
  - 第1引数に監視対象を指定する。`attrs.data`にはDOMで指定した`data`属性の値が入るので、今回は`"users"`となる。
  - 第2引数に監視対象が変更されたときに実行する処理を渡す。今回は描画処理を渡す。
  - 第3引数にtrueを指定すると、監視対象の値が更新されたときに処理が実行されるようになる。監視対象である`users`はまず空の参照が渡されその後APIから受け取ったデータをそこに追加する（参照は変更されない）ので、ここでtrueを指定する必要がある。ここを省略すると参照が更新されたときのみ処理が行われる。
