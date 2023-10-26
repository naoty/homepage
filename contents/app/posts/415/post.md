---
title: ホームページのパッケージ更新をrenovateに移した
description: Netlifyへの請求が発生したのでdependabotからrenovateに移した話
time: 2020-05-09 20:27
tags: ["meta"]
---

以前までこのホームページで使っているnpm packageのバージョン更新をdependabotで自動化していたが、最近renovateを使うようになった。

# Netlifyで無料分を使い切った
あるとき、Netlifyから数ドルほど請求されていることに気づいた。このホームページはNetlifyでホスティングしているのだけど、どうやらビルド時間の上限を超えた分が請求されたらしい。

Build minutesのページを見てみた。

![](build-minutes.png 'ビルド時間')

確かに、極端にビルド時間がかかっている日がある。

原因はdependabotからのパッケージ更新のPull requestごとにNetlifyでビルドをおこなっていることだった。dependabotは更新があったパッケージごとにPull requestを作るため、大量のPull requestが作られてしまう。Pull requestのグループ化を要望する[声](https://github.com/dependabot/feedback/issues/5)はたくさんあるが、まだ実現されてなさそうだ。

# renovateへの移行
そこで、[renovate](https://renovate.whitesourcesoftware.com/)という別のパッケージ更新サービスを使ってみることにした。

dependabotと同様にGitHubで簡単に連携できた。設定ファイルは、`config:base` presetを使うような雰囲気だったけど、どういった設定なのか不透明なのが気持ち悪かったので中身を調べて自分にとって必要な設定にした。

```json
{
  "schedule": ["on friday"],
  "ignorePaths": ["**/node_modules/**"],
  "packageRules": [
    {
      "updateTypes": ["minor", "patch"],
      "groupName": "all minor dependencies",
      "automerge": true
    }
  ]
}
```

* 週末にPull requestをチェックしたいので、更新は金曜日だけにする。
* `node_modules`以下のpackage.jsonは無視する。
* メジャーアップデートはパッケージごとにPull requestを作ってmergeは手動で行う。
* マイナー以下のアップデートはすべてひとつにまとめて、自動的にmergeする。

これで、Pull requestが送られる頻度がかなり抑えられたので、Netlifyでビルドする時間も劇的に減った。
