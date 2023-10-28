---
title: Objective-CでCSVをパースする
time: 2014-04-24 11:12
tags: ['oss']
---


[NTYCSVTable](https://github.com/naoty/NTYCSVTable)というライブラリを使うと簡単にパースできる。名前の通りCSVをテーブル構造のオブジェクトにパースしてくれるので直感的に扱いやすい。Rubyの`CSV::Table`クラスを参考に開発されている。

## インストール

CocoaPodsに公開されているのでPodfileにこのように書いて`pod install`すればインストールできる。

```ruby:Podfile
pod "NTYCSVTable"
```

## 使い方

このようなCSVのパースを想定する。

```csv:users.csv
id,name,age
1,Alice,18
2,Bob,19
3,Charlie,20
```

これをパースするにはこうすればいい。

```objective-c
NSURL *csvURL = [NSURL URLWithString:@"users.csv"];
NTYCSVTable *table = [[NTYCSVTable alloc] initWithContentsOfURL:csvURL];

// Rows
NSArray *rows = table.rows;
NSArray *headers = table.headers;    //=> @[@"id", @"name", @"age"]
NSDictionary *alice = table.rows[0]; //=> @{@"id": @1, @"name": @"Alice", @"age": @18}
NSDictionary *bob = table.rows[1];   //=> @{@"id": @2, @"name": @"Bob", @"age": @19}

// Columns
NSDictionary *columns = table.columns;
NSArray *names = table.columns[@"name"]; //=> @[@"Alice", @"Bob", @"Charlie"]
NSArray *ages = table.columns[@"age"];   //=> @[@18, @19, @20]
```

また、あるヘッダーに特定の値を持つ列を検索するためにこのようなメソッドも用意されている。

```objective-c
[table rowsOfValue:@1 forHeader:@"id"];  //=> @[@{@"id": @1, @"name": @"Alice", @"age": @18}]
[table rowsOfValue:@20 forHeader:@"age"] //=> @[@{@"id": @3, @"name": @"Charlie", @"age": @20}]
```

---

以上、ステマでした。
