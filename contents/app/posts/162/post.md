---
title: AndroidでUserAgentを指定する
time: 2012-12-27 11:48
tags: ['android']
---

`DefaultHttpClient`を使うとUserAgentが`Apache-HttpClient/...`みたいな感じになる。サーバー側でUserAgentを使って制限したりする場合には、以下のようにすれば自由にUserAgentを指定できる。

```java
DefaultHttpClient client = new DefaultHttpClient();
HttpParams params = client.getParams();
params.setParameter(CoreProtocolPNames.USER_AGENT, "ユーザーエージェント");
```
