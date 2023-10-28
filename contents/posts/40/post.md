---
title: 選択されたチェックを画面遷移後も維持する
time: 2011-03-04 13:11
tags: ['rails']
---

　チェックボックスやラジオボタンで選択したものを画面遷移後もチェックしたままにしておきたい、ってことあるじゃないですか。けっこうそういうシーンは多いので、メモ。

```
<% @something_cool.each do |something| -%>
    <%= radio_button_tag "cool", "#{something}", (something == params[:cool]) %><%=h something %>
<% end -%>
```

- radio\_button\_tag（check\_box\_tag）の第3引数はチェックを入れるかどうかをtrue/falseで表します
- このチェックボックスから送信されたパラメータはparams[:cool]に入ります
- （something == params[:cool]）で画面遷移前にチェックされた選択肢と現在の選択肢を比較してtrueを返すことで、チェックを入れます
- 結果的に、これで画面遷移後もチェックを保持できますね
- viewにif文を書くのはあんまりキレイじゃないので、これは便利
