---
title: "#potatotips でTimepieceについて発表した"
time: 2015-05-14 00:20
tags: ['diary']
---

# potatotips

[【第17回】potatotips(iOS/Android開発Tips共有会) (2015/05/13 19:00〜)](http://connpass.com/event/14143/)

# 資料
<script async class="speakerdeck-embed" data-id="3b6280a2a33445e6993dc6b8304331e9" data-ratio="1.33333333333333" src="//speakerdeck.com/assets/embed.js"></script>
# 最近のTimepiece

- GW前あたりから急激にバズってきた。一時GitHubのトレンドで1位になった。それまでは☆70くらいだったけど、もうそろそろ☆500になりそうな勢いだ。
- それに伴っていくつかの要望をPull requestでいただいた。それらはほぼすべてmergeした。機能追加やバグ修正まで自分では見落としていた部分を指摘していただいて、多くの方に使われていそうだという実感がある。

# イベントの感想

- 最近はiOSではなくAndroidアプリ開発をしているので、iOS/Android両方楽しめて非常に良かった。
- Timepieceを検討したけど採用を見送った方の意見を聞けたのが非常に良かった。そういう方の意見を聞ける機会は多くないからだ。いただいた要望について今実装方針を考えていて、ちゃんと形にしていきたい。
- 最近気になっているResultについての議論はとても勉強になった。[naoty/SwiftCSV](https://github.com/naoty/SwiftCSV)でエラー情報を扱う際にResultが使えそうだと思っていた。ただ、議論を聞いてオレオレResultが乱立しそうな流れがありそうだというのを知った。そうなると、ライブラリ提供者が実装するよりも利用者側でResultを定義する方が利便性を損ねないのでは、という意見に変わった。
- ドキュメントだけではよく理解できなかったDagger 2については、あまりよくわかってなかった`@Provide`について理解が深まった。Androidのテストについて意見交換をさせていただいて、自分の意見は間違ってなさそうだという確信を得られたのもよかった。
- その他、Androidの`@Nullable`, `@NonNull`はすぐに使おうと思ったし、Lastlaneやdeliverといったワークフローを自動化するツールも実践的な内容で勉強になった。
