---
title: Container Componentの作り方
time: 2018-09-05T16:39:00+0900
description: Container Componentの実装の個人的なメモ
tags: ["react"]
---

Reactに慣れてきたので、ComponentをContainer ComponentとPresentational Componentに分けるという実装パターンを試している。

Presentational ComponentはFunctional Componentで簡単に書けるけど、Container Componentの書き方がいまいち分かってなかったのでメモする。

```js
import React from "react";

export default class Container extends React.Component {
  render() {
    // 子コンポーネントに渡すprops
    const props = {};

    // this.props.childrenは複数の可能性もあるので
    // React.cloneElement(this.props.children)はエラーになる。
    return React.Children.map(this.props.children, child => (
      // childはテキストの可能性もあるためtype checkする
      if (typeof child === "object") {
        return React.cloneElement(child, props);
      }

      return child;
    ));
  }
}
```

このContainerでstateを管理し、子コンポーネントにprops経由で渡すようなイメージ。あとは、副作用を伴うアクションをContainerで定義しておいて、props経由で渡すこともありそう。

---

## 追記: 2018-09-06 12:30:00

上のような汎用的なContainer Componentを作るならHOCを使う方がいいかもしれない。

```jsx
import React from "react";

export default (Component) => {
  // 引数のComponentをラップするComponentを返す
  return class extends React.Component {
    render() {
      // 自身に渡されたpropsとstateをラップしたComponentに渡す
      return <Component {...this.state} {...this.props} />;
    }
  }
}
```

こっちの方がシンプルに書けそう。
