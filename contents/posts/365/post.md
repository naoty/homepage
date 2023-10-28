---
title: Echoで環境変数を使い回す
time: 2019-04-01T23:25:00+0900
tags: ["go"]
---

# 状況
Echoでデータベースに接続するときなどに環境変数を使ってデータベースのホスト名などの情報を取得したい。

# 問題
必要なときに都度`os.Getenv`で環境変数の値を取得すると、各ハンドラーで同じようなコードを何度も書くことになる。

また、環境変数が設定されていないときのデフォルト値を設定したい場合や`string`以外の型に変換したい場合、さらにコード量が増えてしまう。

# 解決
[kelseyhightower/envconfig](https://github.com/kelseyhightower/envconfig)を使って環境変数を簡単に扱えるようにし、すべてのハンドラーからカスタムコンテキストを通して環境変数にアクセスできるようにした。

```go
// config.go
type Config struct {
  DatabaseHost     string `split_words:"true"`
  DatabaseName     string `split_words:"true"`
  DatabasePassword string `split_words:"true"`
  DatabasePort     int    `split_words:"true"`
  DatabaseUser     string `split_words:"true"`
}
```

```go
// server.go
func main() {
  var config Config
  err := envconfig.Process("", &config)
  if err != nil {
    log.Fatal(err.Error())
  }

  // ...
}
```

* `DATABASE_HOST`のような環境変数に`Config`という構造体からアクセスできるようにしている。`config.DatabaseHost`のようにアクセスできるようになる。`string`型であれば`os.Getenv`でも問題ないけど、`int`型や`bool`型の場合は変換処理が面倒なのでenvconfigを使っている。
* `split_words="true"`というアノテーションをつけることで、スネークケースからキャメルケースに変換している。
* `envconfig.Process`の第1引数は環境変数のプレフィックスになっている。`envconfig.Processs("database", &config)`とすると、`config.Host`で環境変数`DATABASE_HOST`にアクセスできるようになる。必要なければ空文字でいい。

```go
// custom_context.go
type CustomContext struct {
  echo.Context
  Config
}

func CustomContextMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
  return func(c echo.Context) error {
    cc := &CustomContext{c}
    return next(cc)
  }
}

func ConfigMiddleware(config Config) echo.MiddlewareFunc {
  return func(next echo.HandlerFunc) echo.HandlerFunc {
    return func(c echo.Context) error {
      cc := c.(*CustomContext)
      cc.Config = config
      return next(cc)
    }
  }
}
```

```go
// server.go
func main() {
  // ...

  e := echo.New()
  e.Use(CustomContextMiddleware)
  e.Use(ConfigMiddleware(config))

  // ...
}
```

* すべてのハンドラーから`Config`にアクセスできるようにカスタムコンテキストを用意し、そのフィールドに`Config`を追加する。
* カスタムコンテキストをデフォルトのコンテキストで拡張するため、middlewareを設定している。さらに、上で初期化した`Config`をカスタムコンテキストのフィールドに追加するためのmiddlewareも設定している。

このように実装することで、以下のように簡単に環境変数にアクセスできるようになる。

```go
// server.go
func main() {
  // ...

  e.GET("/tasks", getTasks)

  // ...
}

func getTasks(c echo.Context) error {
  cc := c.(*CustomContext)
  dsn := cc.GetDSN()

  // ...
}
```

```go
// config.go
func (c Config) GetDSN() string {
  return fmt.Sprintf(
    "%s:%s@tcp(%s:%i)/%s",
    c.DatabaseUser,
    c.DatabasePassword,
    c.DatabaseHost,
    c.DatabasePort,
    c.DatabaseName,
  )
}
```

* `Config`は`CustomContext`の匿名フィールドなので、`CustomContext`から直接`Config`のメソッドである`GetDSN`を呼ぶことができる。
* 上で説明したとおり、`c.DatabaseUser`などは環境変数`DATABASE_USER`などから値を取得している。
