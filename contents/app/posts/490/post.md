---
title: DartからFirestoreにアクセスする
time: 2022-09-22 21:04
tags: ['dart']
---

# cloud_firestore以外の選択肢
FlutterからFirestoreを利用する場合、[cloud_firestore](https://pub.dev/packages/cloud_firestore)というパッケージを使えばいい。ただ、Flutter以外のDartのコードでFirestoreにアクセスする場合、[googleapis](https://pub.dev/packages/googleapis)というパッケージを使うことになる。このパッケージはおそらくgRPCのサービス定義から自動生成されたクライアントを含んでいるのだと思うけど、ドキュメントにはgRPCかどうかは明記されていないようだ。また、認証には[googleapis_auth](https://pub.dev/packages/googleapis_auth)という別のパッケージも必要になる。

```yaml
dependencies:
  googleapis: ^9.2.0
  googleapis_auth: ^1.3.1
```

# 認証
Firestoreにアクセスする際の認証については、いくつか方法がある。[公式ドキュメント](https://cloud.google.com/docs/authentication)によると、アプリケーションのデフォルト認証情報（以下、ADC）を利用する方式が今回のケースに適しているようだ。

ADCを利用する場合、クライアントライブラリはいくつかの方法でADCを探索することになる。今回は以下のコマンドでADCを生成することで、クライアントライブラリがそれを利用できるようにした。

```
% gcloud auth application-default login
```

Dart側はgoogleapis_authパッケージを使い、以下のように実装することでADCを利用して認証できるようになる。

```dart
final authClient = await clientViaApplicationDefaultCredentials(
  scopes: [FirestoreApi.datastoreScope],
);
```

# Firestoreへのアクセス
googleapisパッケージのコードを使うと、直感的なコードでFirestoreにアクセスできるようになる。以下の例では、ドキュメントのリストを取得している。

```dart
final api = FirestoreApi(authClient);
final response = await api.projects.databases.documents.list(
  'projects/$project_id/databases/(default)/documents',
  '$collection_id',
);
```
