---
title: CHANGELOG.mdを書き始めた
time: 2017-01-06 19:38
tags: ['lifehack']
---

チビチビ開発しているライブラリの1.0.0をリリースしたのを機にCHANGELOGというものを書き始めた。その際にCHANGELOGについて調べていた。

そもそもCHANGELOGは何のために必要なのか考えてみた。CHANGELOGは各バージョンの変更点をざっくり把握するためにあると思う。例えば、Railsの変更点を見たいと思ったとき、まず最初にCHANGELOGを見ると思う。いきなりPull requestやコミットログは見ないだろう。それらは各変更の実装や議論といった詳細を見るのに使われると思う。CHANGELOGは変更の詳細ではなく大まかな変更点の一覧を把握するために使われるんじゃないだろうか。

CHANGELOGを構成する要素はなんだろうか。まず、バージョンとそこに含まれる変更点が挙げられる。そして、変更点の詳細が載ったページへのリンクがあると便利だと思う。変更の種類によってグルーピングするとより見やすくなると思う。よく見かけるのは`Added`, `Changed`, `Fixed`, `Removed`, `Deprecated`などといったラベルで変更点をわけている。リリース前の変更点についても書いておくと、今後の変更予定が分かって便利だと思う。

書き方としては、変更点を上から追記していくスタイルと、バージョンごとに書き換えるスタイルがあると思う。歴史の長いソフトウェアの場合、ひとつのファイルにそれらをすべて載せるのは見にくいので、後者のやり方が合うんじゃないかと思う。Railsなんかはこのスタイルだったと思う。

以上のようなことを踏まえて、このようなフォーマットに至った。

```
# Change Log

## Unreleased

### Added
* `changed(year:month:day:hour:minute:second:nanosecond:)`, which creates a `Date` instance by changing receiver's date components. [#77](https://github.com/naoty/Timepiece/pull/77)
* `changed(weekday:)`, which creates a `Date` instance by changing receiver's weekday. [#77](https://github.com/naoty/Timepiece/pull/77)

## 1.0.2
Released on 2016-12-20.

### Fixed
* Fix testDateInISO8601Format() availability. [#74](https://github.com/naoty/Timepiece/pull/74).
* Specify Swift version for the compilation of watchOS target. [#79](https://github.com/naoty/Timepiece/pull/79).
```

iOSアプリの開発でもCHANGELOGを書くようになった。CHANGELOGの読者としては、開発者自身もそうなんだけど、ベータ版を配信するテスターを主に想定している。ベータ版配信では、fastlaneからFabricを使って配信しているんだけど、その際にCHANGELOG.mdをパースしてリリースノートを自動生成するようにしている。このパーサーはrubygemとして公開している。

[naoty/NTYChangeLog](https://github.com/naoty/NTYChangeLog)
