---
title: 自分をコピーするbotを作る
time: 2014-11-11 15:10
tags: ['oss']
---

自分のTwitterアカウントをコピーするbotを簡単に作れるmirror botというものを作りました。[@naoty\_bot](https://twitter.com/naoty_bot)はこれを使って作りました。

<iframe src="http://hatenablog.com/embed?url=https%3A%2F%2Fgithub.com%2Fnaoty%2Fmirror_bot" title="naoty/mirror_bot" scrolling="no" frameborder="0" style="width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"><a href="https://github.com/naoty/mirror_bot">naoty/mirror_bot</a></iframe>

> [@naoty\_k](https://twitter.com/naoty_k) なんでわざわざ大金払って太ろうとしてるの？バカなの？
> 
> — なおてぃー（bot） (@naoty\_bot) [2014, 11月 10](https://twitter.com/naoty_bot/status/531779458177323009)

<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
# コピーbotを作る手順

１. bot用のアカウントを作ります。

２. 人間とbotそれぞれのアカウントでTwitterアプリケーションを作ります。[ここ](https://apps.twitter.com/app/new)から作れます。そして、人間とbotの両方のアカウント用の「Consumer Key」「Consumer Secret」「Access Token」「Access Token Secret」を取得します（下のスクショのモザイクかかってるところです）。

![f:id:naoty_k:20141110230321p:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20141110/20141110230321.png "f:id:naoty\_k:20141110230321p:plain")

![f:id:naoty_k:20141110230752p:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20141110/20141110230752.png "f:id:naoty\_k:20141110230752p:plain")

![f:id:naoty_k:20141110230803p:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20141110/20141110230803.png "f:id:naoty\_k:20141110230803p:plain")

**追記** : bot用のアプリケーションを作成する際、権限を **Read and Write** にする必要があります。一度Read Onlyでアクセストークンを発行している場合は権限を変更した後もう一度発行しなおして、Herokuアプリケーションの環境変数を新しいアクセストークンに替えてください。

３. こちらのHerokuボタンを押します（別サイトに飛びます）。もしHerokuのアカウントがなければ作ってください。

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/naoty/mirror_bot)

４. 適当なHerokuアプリ名を入れて、「Env」の各項目に2.で取得した「Consumer Key」「Consumer Secret」「Access Token」「Access Token Secret」を入力します。人間のアカウントのものは「HUMAN_\*」に、botのアカウントのものは「BOT_\*」に入れていきます。

![f:id:naoty_k:20141110232038p:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20141110/20141110232038.png "f:id:naoty\_k:20141110232038p:plain")

５．「Deploy for Free」ボタンを押してしばらく待ちます。Herokuにアプリケーションがデプロイされます。その後、アプリのダッシュボード画面で以下のようにdynosを1xにすると、アプリケーションが起動します。

![f:id:naoty_k:20141110232352g:plain](http://cdn-ak.f.st-hatena.com/images/fotolife/n/naoty_k/20141110/20141110232352.gif "f:id:naoty\_k:20141110232352g:plain")

６．終わり。

# コピーbotの機能

- 過去のtweetからランダムに選んで投稿します。ランダムに選ぶとき、現在の時間帯を考慮します。だから、朝には朝っぽいことをtweetするはずです。
- 一日のtweet数やどの時間帯にtweetされる傾向があるかを計算し、そのパターンに従います。例えば、一日にたくさんtweetする人のbotはたくさんtweetしますし、あなたが通勤時間と帰宅時間にtweetする傾向があると、botもその時間帯にtweetする確率が高いです。
- 話しかけるとreplyを返します。replyは過去にあなたがその人に返したreplyからランダムに選ばれます。
- あなたがfavりやすいtweetを学習し、favります。

# 技術的な話

## tweetするタイミングの決定

人間のtweetはHeroku Postgresqlのfree planの上限である10000レコードまで保存されます（上限を超えると古い順に消します）。そのとき、一日の中で何分目に投稿されたかを同時に記録します。たとえば、01:00の投稿は60分目だし、02:00の投稿は120分目、23:59の投稿は1439分目となります。すると、投稿数が多い分と少ない分がわかります。なので、`n分に投稿される確率＝n分の投稿数／総投稿数`を計算することができます。ここから0分から1359分までの確率分布を作ることができます。この確率分布を累積分布にすると実装が簡単になります。そして、0から1までの乱数を生成して累積分布上の重なる分数をbotがtweetする分数として決定します。これを一日にtweetする回数分行い、その日tweetする分を事前に決定しておきます。

以上のようなことを行っているのが`./lib/mirror_bot/scheduler.rb`というファイルです。

## favりやすいtweetの学習と分類

人間は大量に流れてくるtweetの中から特定のtweetだけを選んでfavっています。この行動は大量のメールの中から迷惑メールだけをゴミ箱送りにする行動と似ています。つまり、大量のデータから特定のカテゴリーに含まれるものを識別する、という問題に一般化できると考えました。そこで、スパムフィルタリングと同じアルゴリズムで、大量のtweetから特定のtweetだけをfavoriteというカテゴリーに分類する実装をしました。

スパムフィルタリングの実装はごく普通のベイジアンフィルタです。簡単に言ってしまうと、favられたtweetに含まれやすい単語とか含まれにくい単語を調べていくということをしていきます。形態素解析には[okura](https://github.com/todesking/okura)を使いました。とても便利でした。各単語の各カテゴリーに含まれた回数はRedis（redistogo）に保存しています。

以上のようなことを行っているのが`./lib/mirror_bot/classifier.rb`というファイルです。

## 事前学習とHerokuボタン

以上の2つのモジュール、schedulerとclassifierを機能させるには事前に多くのデータを学習させることが必要です。schedulerについては過去3,200件のtweet、classifierについては800件ずつのfavったtweetとfavってないtweetを学習させています。これを行っているのがtrainerです。trainerは`./lib/mirror_bot/trainer.rb`で定義されており、`./bin/mirror_bot`スクリプトから実行します。

Herokuボタンからbotをデプロイする場合、デプロイして起動するまでにtrainerを実行する必要があります。Herokuボタンによるデプロイを設定する`app.json`には`scripts`という項目があり、こうしたセットアップのための設定が可能です。以下のように指定するだけです。

```
{
    "scripts": {
        "postdeploy": "bundle exec sequel -m migrations $DATABASE_URL && bin/mirror_bot train scheduler && bin/mirror_bot train classifier"
    }
}
```

これでデプロイしてから起動する直前に事前学習を実行することができました。

# なぜ作ったか

最近、機械学習とか自然言語処理に興味が出てきて勉強をしはじめたのですが、何か具体的な目標がほしいと思って「ちょっと賢いbot」を作ることにしました。いろいろ試行錯誤した結果、自分の行動パターンを学習してまねするbotを作ることにしました。

# 得られた知見

- botっぽいアイコンは[http://robohash.org/](http://robohash.org/)で生成できて便利。
- botによる発言を自動生成させようと試行錯誤したけど、結局コピーにすることにしました。まず、マルコフ連鎖を使った文章生成はbotっぽいけど人間らしさはないので、今回は却下。次に、word2vecを使って文章に含まれる単語を類義語と入れ替えることで似たような文章の生成を試みました。word2vecをRubyから使う術がないので、別プロセスでPythonのgensimを使った類義語サーバーを立ててプロセス間通信でRubyに返すみたいな実装をしてみました。ですが、これだとそもそもHerokuの無料枠では不可能でした。さらに、word2vecで使われるモデルファイルが大きすぎてディスクにのっかりません。VPSで挑戦してみましたが、今度は1GBのメモリにのっかりきらずに動きませんでした。思ったほど意味の通じる文章を生成できるわけでもなかったので、この方法は諦めました。
- herokuのオペレーションをスムーズに進めるときに[https://github.com/ddollar/heroku-config](https://github.com/ddollar/heroku-config)と[https://github.com/ddollar/heroku-redis-cli](https://github.com/ddollar/heroku-redis-cli)が便利でした。

# 参考

- 
[![集合知プログラミング](http://ecx.images-amazon.com/images/I/51FgSThMzVL._SL160_.jpg "集合知プログラミング")](http://www.amazon.co.jp/exec/obidos/ASIN/4873113644/hatena-blog-22/)

[集合知プログラミング](http://www.amazon.co.jp/exec/obidos/ASIN/4873113644/hatena-blog-22/)

  - 作者: Toby Segaran,當山仁健,鴨澤眞夫
  - 出版社/メーカー: オライリージャパン
  - 発売日: 2008/07/25
  - メディア: 大型本
  - 購入: 91人 クリック: 2,220回
  - [この商品を含むブログ (277件) を見る](http://d.hatena.ne.jp/asin/4873113644/hatena-blog-22)

- 
[![はじめてのAIプログラミング―C言語で作る人工知能と人工無能](http://ecx.images-amazon.com/images/I/51Al%2BAe8d1L._SL160_.jpg "はじめてのAIプログラミング―C言語で作る人工知能と人工無能")](http://www.amazon.co.jp/exec/obidos/ASIN/4274066649/hatena-blog-22/)

[はじめてのAIプログラミング―C言語で作る人工知能と人工無能](http://www.amazon.co.jp/exec/obidos/ASIN/4274066649/hatena-blog-22/)

  - 作者: 小高知宏
  - 出版社/メーカー: オーム社
  - 発売日: 2006/10
  - メディア: 単行本
  - クリック: 112回
  - [この商品を含むブログ (24件) を見る](http://d.hatena.ne.jp/asin/4274066649/hatena-blog-22)

- [word2vecによる自然言語処理](http://www.oreilly.co.jp/books/9784873116839/)
