---
title: Firefox用Qiita検索プラグイン
time: 2012-09-05 02:10
---

Firefoxの右上の検索ボックスでQiita内の検索を行うためのプラグインを作ってみた。vimperatorであれば`qiita [keyword]`で検索できるようになった。

```xml:qiita.xml
<?xml version="1.0" encoding="utf-8"?>
<SearchPlugin xmlns="http://www.mozilla.org/2006/browser/search/">
    <ShortName>Qiita</ShortName>
    <Description>Search by Qiita</Description>
    <InputEncoding>utf-8</InputEncoding>
    <Image width="16" height="16">http://qiita.com/favicon.ico?v=3</Image>
    <Url type="text/html" method="GET" template="http://qiita.com/search">
        <Param name="q" value="{searchTerms}" />
    </Url>
</SearchPlugin>
```

- macの場合は`~/Library/Application Support/Firefox/Profiles/xxxxxxxx.default/searchplugins/`以下に上のファイルを保存し、firefoxを再起動。（xxxxxxxxの部分はランダム）
- githubみたいにQiitaもプラグインをブラウザに認識させるとcoolだと思う。

![github-plugin](https://dl.dropbox.com/u/1235413/add-github-plugin.png)

- これは以下のような感じでできるらしい（未確認）。

```html
<link
    rel="search"
    type="application/opensearchdescription+xml"
    title="Qiita検索プラグインを追加"
    href="http://qiita.com/searchplugins/qiita.xml" />
```

### 追記（9/5）
- githubのソースを確認したら上のような箇所があった。

```html
<link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="GitHub" />
```

- xmlも上で紹介した形式とほぼ同じだった。

```xml:opensearch.xml
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/"
                       xmlns:moz="http://www.mozilla.org/2006/browser/search/">
  <ShortName>GitHub</ShortName>
  <Description>Search GitHub</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Image width="16" height="16">data:image/x-icon;base64,
  iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ
  bWFnZVJlYWR5ccllPAAAAVpJREFUeNqM0s0rRGEUx/F7x0RKxob4A6bZKBYWFkLZqIkkC7FUsrCw
  oCxsZcN/IFmIP4E9ZWnyurBR3krZeH8b1/dMv5vTpDue+szzzL33nJ5znieIoihIGCGmMIt0+ctS
  bIUETbhHEbm/EqSD5PGOC2TwgHo04xaPv9tIHhbUoPUMXjAcx4aln9BKDcYxgRR20IJNDKEO69hC
  Fie2JnYx3sGYJcQ5jrU2PTjEDbpwpeeXWPZN3NOLnLb8hm1UoaBAG3P6btR26pt4rblDDarRs6KO
  Mh7fmr/idZxgAW3Y0H/r/IqCfYKU5o/yB1b7kY5tGp04Uwmh++5Vcx59PoGNWtV3pznQXK2SbLf7
  6s8kVv09yLpGRro0SwoawIgrt1fNzPtT2FVd/WjVCdiL9qQb5k8ho3Ia8eTKea50TeMd2LZOXQmf
  mP9PrL/K3RjURTrAmk4lMcGPAAMAEvmJGW+ZZPAAAAAASUVORK5CYII=</Image>
  <Url type="text/html" method="get" template="https://github.com/search">
    <Param name="q" value="{searchTerms}"/>
  </Url>
  <moz:SearchForm>https://github.com/search</moz:SearchForm>
</OpenSearchDescription>
```

---

### 環境
- osx mountain lion
- firefox 14

---

### 参考
- http://webos-goodies.jp/archives/50835795.html
