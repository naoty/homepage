---
title: ChatGPT所感
time: 2023-03-20 12:40
tags: []
---

ChatGPTが世間を賑わせるようになって、界隈ではプログラマーの仕事がなくなるのでは?という悲観的な意見を耳にするようになった。だけど、出てしまったものはどうしようもないので、恐れるよりもどうやって使いこなせるかに頭を使っていきたい。

まずは以下のタスクをChatGPTでどこまでこなせるのか確かめてみた。

1. コード生成
1. コードリーディング
1. コードレビュー

# コード生成
簡単なTODOアプリケーションを例にとって自然言語からどこまでコード生成してくれるか確認する。TODOアプリケーションが検証の例として微妙そうという意見はごもっともなのだけど、これだけでも分かることがあった。

まずはプロンプト。仕様からテストコードを生成し、テストコードから実装を生成する順番で指示してみる。

```
以下の仕様を満たす、TODOアプリケーションのテストコードをDartで実装し、ファイル名をつけてください。

- 次のようなコマンドを受け付けるCLIアプリケーションである。
  - `todo list`でTODOの一覧を標準出力に出力する。
  - `todo add <title>`で新しいTODOを追加する。
  - `todo done <id>`で指定したIDのTODOを完了状態にする。
  - `todo delete <id>`で指定したIDのTODOを削除する。
- それぞれのTODOはIDとタイトルと完了しているかのフラグを持つ。
- TODOのデータはファイルとして保存するが、形式やフォーマットは問わない。
```

生成されたテストコード。いい感じな気がする。

```dart
import 'dart:io';
import 'package:test/test.dart';
import '../lib/todo_application.dart';

void main() {
  group('TodoApplication', () {
    final todoApp = TodoApplication();

    setUp(() async {
      // テストデータの作成
      final testTodoList = [
        TodoItem(id: '1', title: 'test1', isDone: false),
        TodoItem(id: '2', title: 'test2', isDone: true),
        TodoItem(id: '3', title: 'test3', isDone: false),
      ];
      await File(TodoApplication.FILE_PATH)
          .writeAsString(testTodoList.map((e) => e.toString()).join('\n'));
    });

    tearDown(() {
      // テストデータの削除
      File(TodoApplication.FILE_PATH).deleteSync();
    });

    test('TodoApplication.list', () async {
      // テストデータをリストアップ
      final todoList = await todoApp.list();

      // リストアップ結果の確認
      expect(todoList.length, 3);
      expect(todoList[0].id, '1');
      expect(todoList[0].title, 'test1');
      expect(todoList[0].isDone, false);
      expect(todoList[1].id, '2');
      expect(todoList[1].title, 'test2');
      expect(todoList[1].isDone, true);
      expect(todoList[2].id, '3');
      expect(todoList[2].title, 'test3');
      expect(todoList[2].isDone, false);
    });

    // snip
}
```

そしてこれをパスさせるコードの生成を指示する。

```
このテストコードをすべてパスさせる実装を出力し、ファイル名をつけてください。
```

生成された実装。

```dart
import 'dart:io';

class TodoItem {
  final String id;
  final String title;
  bool isDone;

  TodoItem({required this.id, required this.title, this.isDone = false});

  @override
  String toString() {
    return '$id,$title,$isDone';
  }
}

class TodoApplication {
  static const FILE_PATH = 'todo.txt';

  Future<List<TodoItem>> list() async {
    final todoList = <TodoItem>[];
    final file = File(FILE_PATH);
    if (await file.exists()) {
      final lines = await file.readAsLines();
      for (final line in lines) {
        final fields = line.split(',');
        todoList.add(TodoItem(
          id: fields[0],
          title: fields[1],
          isDone: fields[2] == 'true',
        ));
      }
    }
    return todoList;
  }

  // snip
}
```

一部省略してあるのだけど、これらのコードはエラーが含まれていて、テストが通らない。コードの修正をすべてChatGPTに依頼すると、提案されたコードにはまた別のエラーが含まれていてキリがない。もしかするともっと良いプロンプトを渡すと精度が上がるのかもしれない。

コード生成はプログラミングの初手としては非常に強力で、数秒で80点くらいのコードが生成されるので、生成されたコードを人間が手直しするというステップを踏めば、生産性が爆発的に上がる感触があった。

# コードリーディング
ChatGPTの主なユースケースの1つとして文章の要約をよく見るので、コードを要約させてみる。試しに、このブログのプレビューサーバーの[実装](https://github.com/naoty/blog/blob/main/lib/blog/rack/post_build.rb)をChatGPTに要約させてみた。

```
以下のコードを要約してください。

（以下、コードを貼り付け）
```

結果、かなり正確に要約されていることがわかった。

>このコードは、Blogという名前のモジュール内にRackという名前の別のモジュールがあり、その中にPostBuildというクラスが定義されています。このクラスは、RackアプリケーションをラップするためのRackミドルウェアであり、リクエストを受けるたびに記事ページを構築します。
>
>このクラスには、アプリケーション、パス、ソースの3つの属性があります。initializeメソッドは、これら3つの属性を設定します。callメソッドは、Rackアプリケーションのリクエストを処理するために呼び出されます。このメソッドでは、リクエストされたURLがパスに一致しているかどうかを確認し、パスから記事IDを抽出します。HTTP_IF_MODIFIED_SINCEヘッダが存在する場合、記事の最終更新日時をチェックし、更新がない場合は304レスポンスを返します。記事を構築するために、build_postメソッドが呼び出されます。記事をレンダリングするために、PostRendererを使用し、記事のHTMLをファイルに保存します。また、記事ページに自動リロードスクリプトを挿入するために、inject_reload_scriptメソッドが使用されます。PostNotFound例外が発生した場合、404レスポンスが返されます。

また、メソッドごとに要約するように依頼すると、メソッドごとの要約が生成された。未知のコードを理解するときにChatGPTを使う場合には、本当に正しいか最終的には人間が確認する必要があるけど、メソッドの単位で要約されている方が確認しやすいだろう。

# コードレビュー
自分が書いたコードに対するレビューをChatGPTに依頼することでどんなアドバイスがもらえるのか試してみた。

```
以下のコードで改善すべきポイントを教えてください。

（以下、コードを貼り付け）
```

>このコードには、次の改善点があります。
>
>1. Rackミドルウェアを記述する場合は、Rack::Utilsを使用してクエリパラメータを解析する必要があります。Rack::Utilsを使用すると、コードがより堅牢になり、パフォーマンスが向上する可能性があります。
>2. HTTPのステータスコード404を返すとき、env変数を渡す必要があります。env変数には、HTTPヘッダーなどの情報が含まれています。現在のコードでは、env変数が引数として渡されていないため、リクエストヘッダーやリクエストメソッドなどの情報が失われてしまいます。
>3. このコードは、例外PostNotFoundを補足していますが、PostNotFoundがどのように定義されているかは明確ではありません。PostNotFoundが定義されていない場合、コードが動作しない可能性があります。PostNotFoundが定義されていない場合は、自分で定義する必要があります。

正確性は微妙なところだが、ここも聞き方を工夫することでより精度の高いコードレビューを受けられそうなポテンシャルを感じる。

コード生成やコードリーディングに比べると、自分が書いたコードに対する質問なので、その内容の正確性を判断しやすいわけで、より気軽に依頼してしまってよさそう。

# まとめ
プログラミングに関わる3つの主なタスクについてChatGPTでどこまでこなせるか確かめてみたけど、現時点では完全に人間を置き換えるものとは言えないものの、プログラミングのタスクを大幅にショートカットできると言って間違いなさそう。
