---
title: react-railsによるCSRF対策
description: react-railsを使ってReactコンポーネントのformにCSRFトークンを渡す
time: 2018-02-18T12:08:00+0900
tags: ["rails", "react"]
---

最近、react-railsを使ってRails上でReactコンポーネントを実装している。フォームを実装する際、Railsのフォームヘルパーは自動的にCSRFトークンを送るように`<input>`を生成してくれるが、Reactコンポーネントでフォームを実装する場合はそれを自分で実装する必要がある。

react-railsであれば、Reactコンポーネントにpropsを簡単に渡せるため、props経由でCSRFトークンを渡すことで実装することができる。

```
// new.html.slim
= react_component "SignUpForm",
  { csrf_params: request_forgery_protection_token, csrf_token: form_authenticity_token }
```

```jsx
// SignUpForm.jsx
render() {
  return (
    <form method="post" action="/sign_up">
      <input type="hidden" name={this.props.csrfParams} value={this.props.csrfToken} />
    </form>
  );
}
```
