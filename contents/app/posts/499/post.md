---
title: モックとスタブ
time: 2023-01-06 23:20
tags: ['test']
---

当たり前すぎるかもしれないけど、ちゃんと言語化しておきたいと思いブログにした。

# モック

```dart
test('Service posts message via API', () {
  // Arrange
  final apiClient = MockApiClient();
  final databaseClient = MockDatabaseClient();
  final service = Service(
    apiClient: apiClient,
    databaseClient: databaseClient,
  );

  // Act
  service.postMessages();

  // Assert
  verify(apiClient.postMessage());
});
```

モックはテスト対象から外部へのコミュニケーションを模倣し、検証する。外部というのは、他のサービス、データベース、メッセージキューなどテスト対象とは別の場所で動いているもの全般を指す。

# スタブ

```dart
test('Service returns the list of messages', () {
  // Arrange
  final apiClient = MockApiClient();
  final databaseClient = MockDatabaseClient();
  final service = Service(
    apiClient: apiClient,
    databaseClient: databaseClient,
  );
  when(databaseClient.query(any)).thenReturn('DUMMY');

  // Act
  final messages = service.listMessages();

  // Assert
  expect(messages, equals(['DUMMY']));
});
```

スタブは外部からテスト対象へのコミュニケーションを模倣する。モックがテスト対象からの出力を模倣するのに対して、スタブはテスト対象への入力を模倣するとも言える。

モックとは異なり、スタブを使ってコミュニケーションを検証しない。スタブはテスト対象への入力なので、テスト対象の内部でどのようなコミュニケーションが行われたかを検証することは、実装の詳細に立ち入りすぎている。詳細と深く結びついたテストは、実装をリファクタリングすると壊れてしまうため、保守性が低いといえる。
