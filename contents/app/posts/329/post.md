---
title: RailsからReduxのinitial stateを設定する
description: コントローラーで作ったデータをReduxのinitial stateに設定できないか試してみた
time: 2018-03-29T23:19:00+0900
tags: ["rails", "react"]
---

```ruby
def new
  @user = User.new
end
```

上のようなコントローラーで作ったデータをReduxのinitial stateとして設定したいと思い、いろいろ考えて書いてみた。

まず、ヘルパーとかデコレーターでモデルをReactコンポーネントに渡すpropsに変換してみる。今回はactive_decoratorを使う。

```ruby
module UserDecorator
  def to_react_props
    as_json(only: %i[first_name last_name email])
      .transform_keys { |key| key.camelcase(:lower) }
      .transform_values { |value| value || "" }
      .to_json
  end
end
```

これでモデルから必要な属性だけをcamelCaseのJSON文字列に変換できるようになった。

次にRailsのviewでdata属性に上のpropsを渡す。あとでここからJSでデータを引っ張ってくる計画だ。

```erb
<div id="js-redux-root" data-react-props="<%= @user.to_react_props %>">
</div>
```

あとは、Reduxのstoreを作成するときに上のpropsを設定する。

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('js-redux-root');
  const initialState = JSON.parse(rootElement.dataset.reactProps);
  const store = createStore(rootReducer, initialState);

  render(
    <Provider store={store}>
      <SignUpForm />
    </Provider>
  );
});
```

これでRailsで作ったデータをReduxのinitial stateに設定できた。フォームの初期値を埋めておきたいときなど、コントローラーからReactコンポーネントにデータを渡せるとラクなので、こういう実装が必要になると思う。

最近、ReactとかReduxを勉強しているので、これでいいのかよくわかりません。コードレビューお願いします。
