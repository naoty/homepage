---
title: Xcodeでビルド設定を作ったらCocoaPodsのリンクに失敗する件
time: 2014-07-16 18:51
tags: ['ios']
---

ステージング環境用にビルドしたくて、`Debug`をコピーして`Staging`というビルド設定を作成したところ、`library not found for -lPods`というエラーが出るようになった。リンク時に失敗しているみたい。

CocoaPodsの設定を調べてみると、Podfileに以下のような設定を追加しなくてはいけないらしい。

```rb:Podfile
xcodeproj "MyProject", { "Staging" => :debug }
```

ビルド設定を作るとき、必ず`Debug`か`Release`のどちらをコピーするか選択するため、`Debug`だったら`:debug`、`Release`だったら`:release`にしてあげればいいようだ。

---

### 参考

- [http://guides.cocoapods.org/syntax/podfile.html#xcodeproj](http://guides.cocoapods.org/syntax/podfile.html#xcodeproj)
