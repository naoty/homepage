---
title: SwiftでRubyのInteger#timesを実装してみた
time: 2014-06-13 00:09
tags: ['swift']
---


Swiftでは数値リテラルがオブジェクトとして扱えるので、Rubyっぽく数値にいろんなメソッドを定義することができる。そこで、簡単な`#times`をSwiftで実装してみた。

```swift
extension Int {
	func times(repeat: (Int) -> ()) {
		for var index = 0; index < self; index++ {
			repeat(index)
		}
	}
}

5.times { n in println("naoty \(n)") }
//=> naoty 0
//=> naoty 1
//=> naoty 2
//=> naoty 3
//=> naoty 4
```

きっと誰かがActiveSupportのような`1.minutes`みたいなExtensionを書くのでしょう（予言）。

---

せっかくなので、Swiftのクロージャの文法について軽く補足してみる。

まず、`#times`メソッドは`(Int) -> ()`型の関数を引数にとる。このとき、以下のように書くことができる。

```swift
5.times({ (n: Int) -> () in
	println("naoty \(n)")
	})
```

`in`以下が十分に短い場合は一行に続けることもできる。

```swift
5.times({ (n: Int) -> () in println("naoty \(n)") })
```

ところで、`#times`の定義で引数の関数の型は`(Int) -> ()`であると明示的に宣言しているので、型推論を利用できる。実際に引数に関数を渡すとき、その関数の型をわざわざ宣言する必要がない。そのため、以下のように書き直せる。

```swift
5.times({ n in println("naoty \(n)") })
```

もし、あるクロージャを関数の最後の引数として渡す場合、クロージャを`()`の外に追い出すことができる。なので、さらに以下のように書き直せる。

```swift
5.times() { n in println("naoty \(n)") }
```

---

### 追記

さらに、クロージャが関数の唯一の引数である場合は`()`を省略できるので、以下のように書き直せる。

```swift
5.times { n in println("naoty \(n)") }
```

ここまで来るとほとんどRubyと同じように書ける。
