---
title: アプリのアイコンを自動生成する
time: 2013-12-15 16:54
tags: ['oss']
---


アイコンをプログラムによって生成して、デフォルトの真っ白なアイコンと差し替えた話です。

## 問題意識

開発中のiOSアプリはデフォルトで真っ白な（iOS7から幾何学模様）アイコンですが、開発中のアプリをいくつかインストールすると、ホーム画面に真っ白なアイコンがズラズラと並びます。iOSアプリを開発したことのある方であれば、見慣れた光景かと思います。こういう画面だと、一目でどのアイコンがどのアプリか判断つかないし、なによりiOSらしからぬダサいホーム画面になってしまいます。

一目でどれがどのアプリか分かって、かつ開発中のアプリで覆い尽くされてもホーム画面が華やかに見える状態を目指して、今回のソリューションを考案しました。

## picon

以上のような問題を解決するため、[picon](https://github.com/naoty/picon)というrubygemを作りました。Xcode 5.0以降が必須です。使い方は簡単で以下のとおりです。

```zsh
$ gem install picon
$ cd path/to/project
$ picon generate
```

これでこんな感じになります。

### Before

![picon_before_s.png](https://qiita-image-store.s3.amazonaws.com/0/1044/bd35114d-5177-835d-bf5d-77a68f3d410a.png "picon_before_s.png")

### After

![picon_after_s.png](https://qiita-image-store.s3.amazonaws.com/0/1044/f117fb38-7db7-d1f2-e558-af2c3437d344.png "picon_after_s.png")

piconはアプリのbundle identifier（com.example.SampleApp的なアレ）のハッシュ値に基づいた[identicon](http://en.wikipedia.org/wiki/Identicon)を生成し、デフォルトのアイコンと差し替えます。bundle identifierに基づいているので、アプリ毎にユニークなアイコンが生成されます。もちろんiPadやiOS 7など各解像度に合わせて生成して差し替えてくれます。実装の中身としては、Xcode 5.0から追加されたAsset Catalogという機能を使っています。新しいAsset Catalogを作成し、そこに生成したidenticonを追加して、最後にデフォルトのアイコンのAsset Catalogと入れ替えています。ちょっと強引なやり方をしていますが。

---

デフォルトのアイコンに見飽きたという方は、ぜひお使いください。また、まだまだ完成度は高くないのでpull reqやissueもお待ちしております。
