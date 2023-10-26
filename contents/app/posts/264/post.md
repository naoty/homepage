---
title: コミット数が多いファイルを表示するコマンドを書いた
time: 2015-06-20 19:04
tags: ['oss']
---

[naoty/hot](https://github.com/naoty/hot)

# インストール

```
$ go get github.com/naoty/hot
```

# 使い方

```
$ cd src/github.com/naoty/Timepiece
$ hot
24: README.md
17: Sources/NSDate+Timepiece.swift
15: Tests/NSDate+TimepieceTests.swift
10: Timepiece.xcodeproj/project.pbxproj
9: Timepiece.podspec
7: Sources/Duration.swift
7: Tests/DurationTests.swift
7: Tests/Int+TimepieceTests.swift
6: Sources/Int+Timepiece.swift
4: Sources/NSDateComponents+Timepiece.swift
2: .travis.yml
2: Tests/NSTimeInterval+TimepieceTests.swift
2: Timepiece.xcodeproj/xcshareddata/xcschemes/Timepiece OSX.xcscheme
2: Sources/NSTimeInterval+Timepiece.swift
1: Timepiece.xcodeproj/xcshareddata/xcschemes/Timepiece iOS.xcscheme
1: Timepiece.xcworkspace/contents.xcworkspacedata
1: .gitignore
1: LICENSE
1: Sources/NSCalendar+Timepiece.swift
1: Sources/NSCalendarUnit+Timepiece.swift
1: Sources/String+Timepiece.swift
1: Tests/NSCalendarUnit+TimepieceTests.swift
1: Tests/String+TimepieceTests.swift
1: Timepiece.playground/Contents.swift
1: Timepiece.playground/Sources/SupportCode.swift
1: Timepiece.playground/contents.xcplayground
1: Timepiece.playground/playground.xcworkspace/contents.xcworkspacedata
1: Timepiece.xcodeproj/Timepiece-Info.plist
1: Timepiece.xcodeproj/TimepieceTests-Info.plist
1: Timepiece.xcodeproj/project.xcworkspace/contents.xcworkspacedata
```

表示件数を`-n <表示したい件数>`で指定したり、パターンを指定してマッチしたファイルだけ表示することができる。

```
$ hot -n 5 "**/*.swift"
17: Sources/NSDate+Timepiece.swift
15: Tests/NSDate+TimepieceTests.swift
7: Sources/Duration.swift
7: Tests/DurationTests.swift
7: Tests/Int+TimepieceTests.swift
```

# 動機

仕事で1年以上開発が行われているコードベースを引き継ぐことになった。僕の仕事は既存のコードを理解しつつ、新たに機能を追加していくことだ。そこで、効率的に既存のコードベースの全体像を把握するため、このようなツールを作ることにした。どれが主要なファイルなのかコミットログから把握できる。

他の使い方としては、例えば各ファイルのコミット数、循環的複雑度、テストカバレッジ等から、プロジェクト全体のバグの出やすさみたいなものを可視化できるかもしれない。
