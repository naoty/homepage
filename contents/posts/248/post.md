---
title: Qiita:TeamのテンプレートとJSONからテキストを組み立てるヤツ
time: 2015-01-02 18:07
tags: ['oss']
---

あけましておめでとうございます。

プログラミング初めとして[naoty/qiita-build](https://github.com/naoty/qiita-build)という簡単なrubygemを作りました。Qiita:Teamで下のようなテンプレートがあったときに

```
# 自己紹介
* 氏名: %{fullname}
* ニックネーム: %{nickname}
* 居住地: %{location}
* 生年月日: %{birthday}
```

標準入力でJSON文字列を渡すと、変数の中身をそれで展開するだけ。

```
$ echo '{"fullname": "Naoto Kaneko", "nickname": "naoty", "location": "Tokyo", "birthday": "1987/6/2"}' | qiita-build -t <TEAM> -a <ACCESS TOKEN> <TEMPLATE ID>
# 自己紹介
* 氏名: Naoto Kaneko
* ニックネーム: naoty
* 居住地: Tokyo
* 生年月日: 1987/6/2
```

とある用途で使いたくて作ったものの、Qiita:Team周りのワークフローを自動化するときに便利そうだなと思ったのでrubygemにしました。

本年も宜しくお願い致します。
