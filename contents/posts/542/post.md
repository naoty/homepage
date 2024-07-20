---
title: sealed classとの付き合い方を考える
time: 2024-07-20 14:07
tags: ['dart']
---

sealed classとパターンマッチによって、従来のオブジェクト指向のアプローチだけでなく、代数的データ型をベースとした関数型プログラミングのアプローチも採れるようになった。

表現力が上がった一方で、どういう場合にどちらのアプローチを採るのがベターなのかを考える必要があるので、この記事では深堀って考えてみたい。

# ケース1：サブクラスを自由に追加できる
Flutterの`StatelessWidget`のようにサブクラスがたくさんあり、自由にサブクラスを追加できる場合を考える。

```dart
abstract class Widget {
  Widget build(BuildContext context);
}

class WidgetA extends Widget {
  @override
  Widget build(BuildContext context) {
    // ...
  }
}

class WidgetB extends Widget {
  @override
  Widget build(BuildContext context) {
    // ...
  }
}
```

```dart
sealed class Widget {}

class WidgetA extends Widget {}
class WidgetB extends Widget {}

Widget build(Widget widget, BuildContext context) {
  switch (widget) {
    case WidgetA():
      // ...
    case WidgetB():
      // ...
  }
}
```

サブクラスを新たに追加した場合、オブジェクト指向のアプローチではそのサブクラスに振る舞いを追加するだけで済むけど、関数型プログラミングのアプローチだと親タイプを利用する処理すべてに影響が及ぶことになる。

サブクラスを自由に追加できるケースだと、オブジェクト指向のアプローチの方が追加にかかるコストが抑えられそうだ。

# ケース2：振る舞いを持たないデータ
次に、いくつかの種類を持つデータを処理したいケースを考えてみる。種類はせいぜい数種類で、増えることもないと仮定する。

```dart
abstract class Data {
  void process();
}

class ValidData extends Data {
  @override
  void process() {
    // ...
  }
}

class InvalidData extends Data {
  @override
  void process() {
    // ...
  }
}
```

```dart
sealed class Data {}

class ValidData extends Data {}
class InvalidData extends Data {}

void process(Data data) {
  switch (data) {
    case ValidData():
      // ...
    case InvalidData():
      // ...
  }
}
```

そもそもデータの処理はデータ自体の振る舞いではないから、メソッドとして定義してあることに違和感がある。また、処理全体がどのように行われるかを知るには、オブジェクト指向のアプローチだと各サブクラスを見なくてはいけないが、関数型プログラミングのアプローチだと関数ひとつですべてを把握できる。

# ケース3：ステートマシン
次にいくつかの種類の状態を遷移するステートマシンの実装を考えてみる。

```dart
abstract class Article {}

class DraftArticle extends Article {
  PublishedArticle publish() => PublishedArticle();
}

class PublishedArticle extends Article {}

void main() {
  final Article article = DraftArticle();
  if (article is DraftArticle) {
    final published = article.publish();
  }
}
```

```dart
sealed class Article {}

class DraftArticle extends Article {
  PublishedArticle publish() => PublishedArticle();
}

class PublishedArticle extends Article {}

void main() {
  final Article article = DraftArticle();
  switch (article) {
    case DraftArticle():
      final published = article.publish();
    default:
      break;
  }
}
```

それぞれの状態を表すサブクラスを定義した場合、状態によって可能な振る舞いが異なるため、どのサブクラスなのかを判別する必要がある。クラスの定義自体はsealed classを使わなくても大きな違いはないけど、sealed classを使うことで網羅性のチェックができるようになるし、パターンマッチによる分割代入も使えるのでsealed classを使わない理由はなさそうだ。
