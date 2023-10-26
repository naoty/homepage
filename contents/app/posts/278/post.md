---
title: SwiftCSVをフルスクラッチした
time: 2016-02-24 23:15
tags: ['oss']
---

おととしSwiftCSVというCSVをSwiftで扱うためのライブラリを作った。

[naoty/SwiftCSV](https://github.com/naoty/SwiftCSV)

けっこう思いつきで作ったので、あんまりちゃんとパースできないし、思ったよりissueがたくさん来てつらくなってしまったので、放置していた。仕事でもSwiftをまったく書けずにいて、Swiftを触るモチベーションも低かった。

**今年に入ってSwiftをガンガン仕事で書くようになってモチベーションが復活したので、ひどい有様だったSwiftCSVをフルスクラッチすることにした** 。幸い、テストコードはギリギリあったので振る舞いは変えずに内部のコードを綺麗にし、Swift 2.1に対応した。

SwiftCSVを書くにあたって活躍したのは`GeneratorType`と`SequenceType`というprotocolだった。これらは`for ... in`文に渡すことができる独自のイテレータを定義できる。これらの使い方は以前Qiitaにまとめたので参考になるかもしれない。

[GeneratorとSequence - Qiita](http://qiita.com/naoty_k/items/970796fe56b4ab083278)

これらを使うことで、 **「イテレートされる要素を作る責務」と「その要素を使う責務」を切り分けて、別々のオブジェクトとして定義できる** 。実際にSwiftCSVでは以下のように切り分けられている。

```
// CSV.swift

init(string: String, delimiter: NSCharacterSet = comma) {
    let headerSequence = HeaderSequence(text: string, delimiter: delimiter)
    for fieldName in headerSequence {
        header.append(fieldName)
        columns[fieldName] = []
    }

    // ...
}
```

```
// HeaderSequence.swift

struct HeaderGenerator: GeneratorType {
    typealias Element = String
    
    private var fields: [String]
    
    init(text: String, delimiter: NSCharacterSet) {
        let header = text.lines[0]
        fields = header.componentsSeparatedByCharactersInSet(delimiter)
    }
    
    mutating func next() -> String? {
        return fields.isEmpty ? .None : fields.removeAtIndex(0)
    }
}

struct HeaderSequence: SequenceType {
    typealias Generator = HeaderGenerator
    
    private let text: String
    let delimiter: NSCharacterSet
    
    init(text: String, delimiter: NSCharacterSet) {
        self.text = text
        self.delimiter = delimiter
    }
    
    func generate() -> HeaderGenerator {
        return HeaderGenerator(text: text, delimiter: delimiter)
    }
}
```

`GeneratorType`と`SequenceType`を使うことで設計上はうまく整理できたものの、CSVパーサとしての機能はかなりショボい。ダブルクォーテーションに囲まれた`,`や改行を認識できていない。けっこう大変そうで僕だけでは対応ができないので、Pull requestを募集している。
