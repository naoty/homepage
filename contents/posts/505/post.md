---
title: Streamと仲良くなる
time: 2023-02-19 13:47
tags: ['dart']
---

今までなんとなくでStreamを触ってきたけど、そろそろちゃんと理解しておきたいので記事に残すことにした。基本的なところからエラーハンドリングまで調べたり手を動かして検証した。

# Streamの生成

## `async*`による生成

```dart
Stream<int> countStream(int max) async* {
  for (var i = 0; i <= max; i++) {
    yield i;
  }
}
```

`async*`がついた関数を呼ぶとStreamが生成され、関数が終了するとそのStreamは終了する。その間、`yield`や`yield*`によってStreamに値を送ることができる。

`yield`は値をそのままStreamに送るのに対して、`yield*`は別のStreamを受け取り、そのStreamから受け取った値を`yield`する。

## 別のStreamから生成

```dart
final stream = countStream(10).map((n) => n * 2);
```

`Stream`クラスには新しい`Stream`を生成するための便利なメソッドが用意されている。例えば、以下のようなメソッドが定義されている。

- `map`: 引数の関数で変換した値を送る新たなStreamを生成する。
- `where`: 引数の条件を満たす値を送る新たなStreamを生成する。
- `take`: 最初のN件の値だけを返す新たなStreamを生成する。
- `skip`: 最初のN件をスキップした残りの値を返す新たなStreamを生成する。
- `cast`: 実行時に型キャストした値を返す新たなStreamを生成する。

## `StreamController`による生成
これだけで1本記事が書けそうなので今回は割愛する。

## エラーハンドリング

```dart
Stream<int> countStream(int max) async* {
  for (var i = 0; i <= max; i++) {
    if (i == 5) {
      // throw Exception('error for $i') はNG
      yield* Stream.error(Exception('error for $i'));
    } else {
      yield i;
    }
  }
}
```

Streamの生成時にエラーが発生した場合、エラーをStreamに送る必要がある。`throw`してしまうと、Streamを生成する関数自体が例外を投げてしまう。エラーをStreamに送ると、後述するように`handleError`等によって利用側がエラーハンドリングできるようになる。

`async*`を使って生成する場合、上のように`Stream.error`で単一のエラーを送るStreamを作り`yield*`に渡すことでエラーをStreamに送ることができる（もっと簡単にできる方法があれば教えてください）。`map`等で別のStreamから生成する場合も同様にできるはず。

# Streamの利用

## `await for`による利用

```dart
void main() async {
  var total = 0;
  await for (final n in countStream(10)) {
    total += n;
  }
  print(total);
}
```

`await for`文を使うと、Streamから値を受け取るまで待機し、値を受け取ったら処理できる。

## Streamクラスのメソッドによる利用

```dart
void main() async {
  final total = await countStream(10).reduce((a, b) => a + b);
  print(total);
}
```

`Stream`クラスにはStreamの値を処理して結果を`Future`として出力するメソッドが用意されている。例えば、以下のようなメソッドが定義されている。

- `any`: Streamの値のいずれかが条件を満たすかを返す。
- `contains`: Streamに引数の値が含まれるかを返す。
- `reduce`: Streamの値を集約して一つの値を返す。
- `drain`: Streamが完了したら引数の値を返し、エラーが発生したらエラーを返す。
- `toList`: Streamの値を`List`にして返す。

## `listen`による利用

```dart
void main() {
  var total = 0;

  countStream(10).listen(
    (n) => total += n,
    onDone: () => print(total),
  );
}
```

`listen`メソッドを使うと、Streamの値を受け取ったときの処理、Streamが完了したときの処理などをより汎用的に定義できる。

## エラーハンドリング
Streamの生成側のエラーハンドリングで使ったコードを利用する場合を考える。

```dart
void main() async {
  var total = 0;

  try {
    await for (final n in countStream(10)) {
      total += n;
    }
  } catch (error) {
    print(error); //=> Exception: error for 5
  }

  print(total); //=> 10
}
```

`await for`で値を受け取る場合、途中でエラーを受け取ると`await for`はStreamの処理を中止しそのエラーを`throw`する。なので、エラーハンドリングするには`await for`を`try ... catch`で囲む必要がある。そして、エラーを受け取るまでは処理されるが、`catch`した時点ではループを抜けているため、その後の処理を継続させることができない。

```dart
void main() {
  var total = 0;

  countStream(10).listen(
    (n) => total += n,
    onDone: () => print(total), //=> 50
    onError: (error) => print(error), //=> Exception: error for 5
    cancelOnError: false,
  );
}
```

`listen`で値を受け取る場合はより細かくエラーを受け取ったときの処理を定義できる。`onError`でエラーを受け取ったときの処理を定義でき、`cancelOnError`でエラーを受け取ったときにStreamをcancelするかどうかを設定できる。デフォルトではこれが`false`なので、エラーを受け取っても処理を継続できる。
