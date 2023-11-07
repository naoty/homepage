---
title: DartのASTを参照する
time: 2023-04-29 21:38
tags: ['dart']
---

# 背景
Dartのプロジェクトにおいてファイル間の依存関係を明らかにしたいニーズが出てきたため、DartのASTを参照する方法を調べようと思った。ASTを利用すれば`import`文を解析することで依存関係を明らかにできるだろうと考えた。

# analyzerパッケージ
DartのASTを参照するには、analyzerパッケージを使う。このパッケージはIDEなどで使われるAnalysis Serverを提供している他、linterの実装でも利用されている。

使い方としては、`parseFile`関数でファイルに含まれるDartのソースコードをASTに変換する。

```dart
final result = parseFile(
  path: 'path/to/code.dart',
  featureSet: FeatureSet.latestLanguageVersion(),
);
// result.unitからASTを参照できる
```

# ASTを表すクラス群
`result.unit`は`Directive`のリストと`Declaration`のリストから成る。`Directive`や`Declaration`は以下のような継承ツリーの一部に含まれていて、特に`Directive`のサブクラスとしては`ImportDirective`や`ExportDirective`が存在する。

![Node](/posts/513/nodes.png)

# AstVisitor
ASTのノードの親クラスにあたる`AstNode`には`visitChildren`というメソッドが用意されている。`AstVisitor`型のvisitorを引数に渡すと、ASTのnodeの種類に対応したvisitorのメソッドが呼び出されるようになっている。`AstVisitor`は抽象型で、これを実装したクラスがいくつか用意されている。

- `SimpleAstVisitor`: メソッドはすべて実装されているが、何もしない。これが他のvisitorのベースになっているようだ。
- `RecursiveAstVisitor`: nodeがchildrenを持っているときに再帰的にASTのツリーをたどる。これも実際には何もしないので、これを継承することで、再帰的にnodeをたどってnodeの種類に応じた処理を実装できる。

これらを利用して`import`したファイルを取得するだけのvisitorを実装してみる。

```dart
class ImportVisitor<R> extends SimpleAstVisitor<R> {
  final List<String> importedUris = [];

  @override
  R? visitImportDirective(ImportDirective node) {
    importedUris.add(node.uri.stringValue!);
    return super.visitImportDirective(node);
  }
}

void main() {
  final result = parseFile(
    path: 'path/to/code.dart',
    featureSet: FeatureSet.latestLanguageVersion(),
  );

  final visitor = ImportVisitor<void>();
  result.unit.visitChildren(visitor);

  print(visitor.importedUris);
}
```

`AstVisitor`の`visitImportDirective`は`ImportDirective`型のnodeを見つけたときに呼ばれるメソッドで、今回はこれをリストに追加して、ファイル中のすべての`import`されているファイルを収集している。

このように`AstVisitor`を利用することで、特定の種類のnodeのみに対して行う処理を簡潔に実装できるため、アイデア次第でいろんな応用ができるだろう。
