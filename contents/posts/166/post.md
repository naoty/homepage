---
title: Limechatのテーマつくった
time: 2013-01-13 00:26
---

昨年末から社内にIRCが導入されてから、クライアントツールにLimechatを使ってる。とりあえずデフォルトの`Limelight`というテーマを使ってたけど、ビミョーに違和感があったので、自分でテーマを作ってみた。

![f:id:naoty_k:20130113000307p:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20130113/20130113000307.png "f:id:naoty\_k:20130113000307p:plain")

[https://github.com/naoty/Nakameguro](https://github.com/naoty/Nakameguro)

1時間くらいであっさりできてしまったので、そのコツをメモしておく。

### cssとyamlを使う

Limechatのテーマはcssとyamlの2つで定義していく。cssはチャットのログが表示される部分（上下）のスタイルを定義するのに使い、yamlはユーザー一覧・サーバー一覧・入力部分のスタイルを定義するのに使う。これらを`~/Library/Application Support/Limechat/Themes/`以下におけば、LimechatのPreferencesからテーマを設定できるようになる。

### サンプルを参考にする

`~/Library/Application Support/Limechat/Themes/`に`Sample.css`と`Sample.yaml`がある。これを参考に、どのクラスがどの部分にあたるのかだいたい把握できる。例えば、時間のテキストは`.time`というクラスがついてるし、`.sender[type=myself]`というクラスは自分のニックネームにあたる。

### sassが便利

今回はcssは直接書かずにsassで書いてみた。色を多用するから、それぞれの色に変数名をつけたかった。

```
$ gem install sass
$ sass --watch Nakameguro.sass:Nakameguro.css
```

とすると、`Nakameguro.sass`を保存するたびにcssに変換されるため、すぐに変更を確認できる。便利。

### 小言

毎日使うツールは自由にカスタマイズできた方がいい。自分に合うようにカスタマイズすることで快適に開発できる。今はGUIなLimechatを使ってるけど、より柔軟にカスタマイズしたくなったらWeechatに移行するかも。
