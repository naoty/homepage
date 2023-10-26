---
title: zshに戻った
time: 2018-05-16T21:34:00+0900
description: fishからzshに戻った話
---
1年くらい前からシェルはfishを使っていたけど、最近zshに戻ってきた。理由としては、当時はやってなかったインフラの作業がメインの業務になり、シェルスクリプトを書くようになったからだ。fishはbashとの互換性がないので、bashを書くときに頭を切り替えるのが少しずつストレスになってきた。

fishを使っていた頃は[fisherman](https://github.com/fisherman/fisherman)というプラグインマネージャーを使っていたけど、zshでもプラガブルな設定は続けていきたいので[zplug](https://github.com/zplug/zplug)を使い始めた。

相変わらずzshのプラグインはいい感じのものがないので、またも自分で[プロンプト](https://github.com/naoty/prompt)を書くことになった。世の中の人気のあるプロンプトのテーマは余計な情報が多くて重いので、結局いつも自分で書くことになっている。[pure](https://github.com/sindresorhus/pure)はよさそうだったけど、二列に慣れず惜しくも採用できなかった。
