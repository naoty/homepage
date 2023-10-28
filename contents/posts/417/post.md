---
title: エラーの判別
time: 2020-05-23 18:10
tags: ["go"]
---

# ダメなケース

同じメッセージを持つ、別々のエラーは等しくない。

```go
err1 := errors.New("user not found")
err2 := errors.New("user not found")
fmt.Println(err1 == err2) //=> false
```

なので、こういったコードはうまくいかない。

```go
package user

func Lookup() (*User, error) {
  return nil, errors.New("user not found")
}
```

```go
package main

func main() {
  user, err := user.Lookup()
  if err == errors.New("user not found") {
    fmt.Fprintln(os.Stderr, "failed to lookup user")
  }
}
```

# シンプルなエラーの判別

エラーを比較するには、エラーを生成するコードとエラーを判別するコードの間でエラーを共有する。

```go
package user

var ErrNotFound = errors.New("user not found")

func Lookup() (*User, error) {
  return nil, ErrNotFound
}
```

```go
package main

func main() {
  user, err := user.Lookup()
  if err == user.ErrNotFound {
    fmt.Fprintln(os.Stderr, "failed to lookup user")
  }
}
```

# データをもつエラーの判別

データをもつエラーを表現するには、`Error()`を実装する型を定義する。`errors.As()`を使うと、エラーの判別をしつつ型アサーションにより内部のデータにアクセスできる。

```go
package user

type ErrNotFound struct {
  ID int
}

func (err ErrNotFound) Error() string {
  return fmt.Sprintf("user not found: %d", err.ID)
}

func Lookup(id int) (*User, error) {
  return nil, ErrorNotFound{ID: id}
}
```

```go
package main

func main() {
  user, err := user.Lookup(1)

  var notFoundErr user.ErrNotFound
  if errors.As(err, &notFoundErr) {
    fmt.Fprintf(os.Stderr, "failed to lookup user ID:%d\n", notFoundErr.ID)
  }
}
```
