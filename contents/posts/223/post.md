---
title: shields.ioでバッジをフラットデザインにする
time: 2014-07-10 12:51
---

[http://shields.io](http://shields.io)というサービスを使うとフラットデザインのバッジをSVG形式で返してくれるので、これを以下のような感じで使うだけです。

## Travis
[![Build Status](https://travis-ci.org/naoty/NTYCSVTable.svg?branch=master)](https://travis-ci.org/naoty/NTYCSVTable) -> [![Build Status](http://img.shields.io/travis/naoty/NTYCSVTable/master.svg?style=flat)](https://travis-ci.org/naoty/NTYCSVTable)

```diff
-[![Build Status](https://travis-ci.org/naoty/NTYCSVTable.svg?branch=master)](https://travis-ci.org/naoty/NTYCSVTable)
+[![Build Status](http://img.shields.io/travis/naoty/NTYCSVTable/master.svg?style=flat)](https://travis-ci.org/naoty/NTYCSVTable)
```

## CocoaPods
[![Version](http://cocoapod-badges.herokuapp.com/v/NTYCSVTable/badge.png)](http://cocoadocs.org/docsets/NTYCSVTable) -> [![Version](http://img.shields.io/cocoapods/v/NTYCSVTable.svg?style=flat)](http://cocoadocs.org/docsets/NTYCSVTable)
[![Platform](http://cocoapod-badges.herokuapp.com/p/NTYCSVTable/badge.png)](http://cocoadocs.org/docsets/NTYCSVTable) -> [![Platform](http://img.shields.io/cocoapods/p/NTYCSVTable.svg?style=flat)](http://cocoadocs.org/docsets/NTYCSVTable)

```diff
-[![Version](http://cocoapod-badges.herokuapp.com/v/NTYCSVTable/badge.png)](http://cocoadocs.org/docsets/NTYCSVTable)
-[![Platform](http://cocoapod-badges.herokuapp.com/p/NTYCSVTable/badge.png)](http://cocoadocs.org/docsets/NTYCSVTable)
+[![Version](http://img.shields.io/cocoapods/v/NTYCSVTable.svg?style=flat)](http://cocoadocs.org/docsets/NTYCSVTable)
+[![Platform](http://img.shields.io/cocoapods/p/NTYCSVTable.svg?style=flat)](http://cocoadocs.org/docsets/NTYCSVTable)
```

## その他
[http://shields.io](http://shields.io)を見ると、他にもcoverallとかcode climateなどよく使われるバッジが提供されているようです。
