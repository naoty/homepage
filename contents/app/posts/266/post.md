---
title: GeneratorとSequence
time: 2015-07-11 19:07
tags: ['swift']
---


# GeneratorType
generatorとは新しい要素を返す処理のことで、以下の`GeneratorType`プロトコルに従う。

```swift
protocol GeneratorType {
	typealias Element
	func next() -> Element?
}
```

例えば、文字列を各行を返すgeneratorはこんな感じで実装する。

```swift
class LineGenerator: GeneratorType {
    typealias Element = String
    
    var lines: [String]
    
    init(text: String) {
        self.lines = text.componentsSeparatedByString("\n")
    }
    
    func next() -> Element? {
        return lines.isEmpty ? nil : lines.removeAtIndex(0)
    }
}

let text = "いろはにほへと ちりぬるを\nわかよたれそ つねならむ\nういのおくやま けふこえて\nあさきゆめみし よひもせず"
let generator1 = LineGenerator(text: text)
generator1.next() //=> いろはにほへと ちりぬるを
generator1.next() //=> わかよたれそ つねならむ
generator1.next() //=> ういのおくやま けふこえて
generator1.next() //=> あさきゆめみし よひもせず
generator1.next() //=> nil
```

# GeneratorOf
generatorを書くとき上のようにクラスを定義するのが面倒なら、`GeneratorOf<T>`構造体が便利。以下のような感じで定義されている。

```swift
struct GeneratorOf<T>: GeneratorType, SequenceType {
	init(_ nextElement: () -> T?)
	
	mutating func next() -> T?
}
```

`GeneratorOf`構造体は`GeneratorType`プロトコルに従っており、初期化時に渡されたクロージャを`next()`で実行するようになっている。なので、上のコードは以下のように書き直せる。

```swift
func lineGenerator(#text: String) -> GeneratorOf<String> {
    var lines = text.componentsSeparatedByString("\n")
    return GeneratorOf { return lines.isEmpty ? nil : lines.removeAtIndex(0) }
}

var generator2 = lineGenerator(text: text)
generator2.next() //=> いろはにほへと ちりぬるを
generator2.next() //=> わかよたれそ つねならむ
generator2.next() //=> ういのおくやま けふこえて
generator2.next() //=> あさきゆめみし よひもせず
generator2.next() //=> nil
```

# SequenceType
sequenceはループによって中身の要素を走査できる構造のことで、以下の`SequenceType`プロトコルに従う。

```swift
protocol SequenceType {
	typealias Generator: GeneratorType
	func generate() -> Generator
}
```

sequenceはgeneratorを`generate()`で生成して、それを使って中身の要素に順にアクセスする。`SequenceType`プロトコルに従うオブジェクトは`for-in`ループに渡すことができる。

```swift
class LineSequence: SequenceType {
    typealias Generator = LineGenerator
    
    var text: String
    
    init(text: String) {
        self.text = text
    }
    
    func generate() -> Generator {
        return LineGenerator(text: text)
    }
}

for line in LineSequence(text: text) {
    print(line)
}
```

# SequenceOf
`GeneratorOf`と同様に`SequenceOf`も存在する。

```swift
struct SequenceOf<T>: SequenceType {
	init<G: GeneratorType where T == T>(_ makeUnderlyingGenerator: () -> G)
	func generate() -> GeneratorOf<T>
}
```

```swift
func lineSequence(#text: String) -> SequenceOf<String> {
	return SequenceOf { return lineGenerator(text: text) }
}

for line in lineSequence(text: text) {
	print(line)
}
```
