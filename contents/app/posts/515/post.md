---
title: クラスに対するextendsとimplements
time: 2023-06-11 18:29
tags: ['dart']
---

Dartでは、クラスに対して`extends`することも`implements`することもできるのが他の言語とは明らかに違うポイントで、書いていて少し混乱したので、整理してみた。

こんな感じの雑なクラスを`extends`あるいは`implements`する例を考えてみる。

```dart
class Article {
  final String title;
  
  bool get isPublished => _isPublished;
  bool _isPublished = false;

  Article({required this.title});

  void publish() {
    _isPublished = true;
  }
}
```

# extends
`extends`はあるクラスを継承したサブクラスを定義する。他の言語と変わったところはなにもない。

```dart
class DraftArticle extends Article {
  DraftArticle({required String title}) : super(title: title);
}
```

スーパークラスを継承しているから、`super`でスーパークラスを参照できるし、実装もスーパークラスのものをそのまま利用できる。

# implements
Dartの面白い仕様の1つに、すべてのクラスが暗黙的にinterfaceを提供するというものがある。`implements`はあるクラスが提供するinterfaceを実装する新しいクラスを定義する。

```dart
class PublishedArticle implements Article {
  @override
  final String title;
  
  @override
  final bool isPublished = true;
  
  @override
  bool _isPublished = true;
  
  PublishedArticle({required this.title});
  
  @override
  void publish() {}
}
```

継承する場合と異なる点は以下のようなポイントがある。

- すべてのメソッドやgetter, setterを実装する必要がある。
- 複数のスーパークラスを継承できない一方で、複数のクラスのinterfaceであれば実装できる。

この例だと、privateなフィールドまで実装する必要があり、わざわざinterfaceを実装するメリットが感じられない。

# abstract class
`abstract class`と宣言すると、インスタンスを初期化できないクラスを定義できる。また、abstract classは実装を持たないメソッドも定義できる。他の言語に現れるinterfaceに近い。

```dart
abstract class Article {
  final String title;

  Article({required this.title});

  void publish();
}
```

abstract classのサブクラスは実装をもたないメソッドを実装する必要がある。

```dart
class DraftArticle extends Article {
  bool get isPublished => _isPublished;
  bool _isPublished = false;
  
  DraftArticle({required String title}) : super(title: title);
  
  @override
  void publish() {
    _isPublished = true;
  }
}
```
