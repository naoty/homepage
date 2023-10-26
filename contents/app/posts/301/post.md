---
title: net/httpによるHTTPメソッドを含んだルーティングの実装
time: 2017-09-24 14:35
tags: ['go']
---

最近GoによるWebアプリケーション開発を学び始めたので間違っている箇所があればコメントください。

## ServeMux型によるルーティング

`http.Handle`関数を使うとパスに対するルーティングを登録することができる。`http.Handler`型は実際にリクエストを処理するオブジェクトで、下のように実装すると`/foods`へのリクエストを`*FoodsHandler`型が処理することになる。

```
http.Handle("/foods", &handlers.FoodsHandler{})
```

`http.Handle`関数によって登録されたルーティングは`http.DefaultServeMux`という`*ServeMux`型の変数が保持することになる。

```
type ServeMux struct {
    mu sync.RWMutex
    m map[string]muxEntry
    hosts bool
}

type muxEntry struct {
    h Handler
    pattern string
}
```

登録されたルーティングはフィールド`m`で保持される。サーバーは`m`から一致するパスを探し、対応する`Handler`を呼び出す。

見たところ、`ServeMux`型では`GET`, `POST`等のHTTPメソッドを考慮していない。RESTful APIを実装するにはHTTPメソッドを考慮する必要があるため、`ServeMux`型によるルーティングでは不十分だと分かる。そこで、ルーティングを自前で実装する。

## Handlerによるルーティング

`http.Handle`関数の代わりに`http.ListenAndServe`関数に渡す`http.Handler`によってルーティングを実装する。

```
http.ListenAndServe(":8080", handler)
```

`http.DefaultServeMux`を使う場合は`handler`の代わりに`nil`を渡すが、自前のハンドラーを使う場合はここに渡す。

```
type RoutesHandler struct {
    routes map[string]map[string]http.Handler
}

func (h *RoutesHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    paths, ok := h.routes[r.Method]
    if !ok {
        w.WriteHeader(http.StatusNotFound)
        return
    }

    handler, ok := paths[r.URL.Path]
    if !ok {
        w.WriteHeader(http.StatusNotFound)
        return
    }

    handler.ServeHTTP(w, r)
}
```

`*ServeMux`型とは違い、`map[string]map[string]http.Handler`型のフィールド`routes`でHTTPメソッドを含むルーティングを管理するようにした。`ServeHTTP`関数を実装することで`http.Handler`型のインターフェイスを満たしている。内部で`routes`から一致するハンドラーを呼び出す。

```
func (h *RoutesHandler) GET(path string, handler http.Handler) {
    h.register("GET", path, handler)
}

func (h *RoutesHandler) POST(path string, handler http.Handler) {
    h.register("POST", path, handler)
}

func (h *RoutesHandler) register(method, path string, handler http.Handler) {
    if h.routes == nil {
        h.routes = make(map[string]map[string]http.Handler)
    }

    _, ok := h.routes[method]
    if !ok {
        h.routes[method] = make(map[string]http.Handler)
    }

    h.routes[method][path] = handler
}
```

こうした関数を定義し、ルーティングを登録できるようにする。

```
routesHandler := &handlers.RoutesHandler{}
routesHandler.GET("/foods", &handlers.FoodsHandler{})

http.ListenAndServe(":8080", routesHandler)
```
