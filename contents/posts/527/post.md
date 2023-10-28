---
title: DartのパターンマッチでJSONを扱う
time: 2023-10-14 21:14
tags: ['dart']
---

Dart 3で導入されたパターンマッチに慣れるため、JSONのパースを試してみたところ、とても便利で最高だったのでブログに残しておきたい。

# パターンマッチを使わない場合

```dart
const pokedex = '''[
  {"id": 1, "name": "Bulbasaur", "type": ["Grass", "Poison"]},
  {"id": 4, "name": "Charmander", "type": ["Fire"]},
  {"id": 7, "name": "Squirtle", "type": ["Water"]}
]''';

void main() {
  try {
    final array = json.decode(pokedex);
    if (array is List<dynamic>) {
      for (final object in array) {
        if (object is Map<String, dynamic> &&
            object['id'] is int &&
            object['name'] is String &&
            object['type'] is List<dynamic>) {
          print(
              'id: ${object['id']}, name: ${object['name']}, types: ${object['type']}');
        }
      }
    }
  } catch (_) {
    print('failed to decode');
  }
}
```

要素の型をちゃんとチェックしようとすると、かなり冗長なコードになってしまう。

# パターンマッチを使う場合

```dart
const pokedex = '''
[
  {"id": 1, "name": "Bulbasaur", "type": ["Grass", "Poison"]},
  {"id": 4, "name": "Charmander", "type": ["Fire"]},
  {"id": 7, "name": "Squirtle", "type": ["Water"]}
]
''';

void main() {
  if (json.decode(pokedex) case List<dynamic> array) {
    for (final {
          'id': int id,
          'name': String name,
          'type': List<dynamic> types,
        } in array) {
      print('id: $id, name: $name, types: $types');
    }
  } else {
    print('failed to decode');
  }
}
```

型チェックと同時に変数へのbindをおこなっているため、簡潔でわかりやすいコードになった。`Map`の要素に対する型チェックもかなり簡潔になっている。パターンマッチのポイントは以下のとおり。

- `if (<変数> case <パターン>) {}`でパターンマッチをおこない、マッチしたかどうかで分岐できる。
- `for (<パターン> in <変数>) {}`でリストの要素に対してパターンマッチをおこない、マッチした要素だけを処理できる。
- パターンに`{'<キー>': <パターン>}`を渡すことでキーを指定しつつ、値に対してさらなるパターンマッチをおこなえる。
- `int id`のように型宣言した変数名をパターンに渡すことで、型に一致した場合のみマッチするようにしつつ、変数名にマッチした値をbindさせている。
- `List<dynamic> types`としているところを`List<String> types`とすると、`Uncaught Error: Bad state: Pattern matching error`というエラーが発生してしまうので、`dynamic`のままにしている。ここはもっとうまいやり方があるかも。
