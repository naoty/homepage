---
title: mrb_valueについて調べてみた
time: 2013-05-04 20:49
tags: ['mruby']
---

[昨日](http://naoty.hatenablog.com/entry/2013/05/03/231346)の続き。

mrubyのソースコードを読むと、`mrb_value`という構造体がよく出てくるのでソースコードを追いかけて使い方を調べてみた。参照しているコミット番号は昨日と同じく「9663a7」です。

## mrb\_valueの定義

```
// include/mruby/value.h:40

typdef struct mrb_value {
  union {
    mrb_float f;
    void *p;
    mrb_int i;
    mrb_sym sym;
  } value;
  enum mrb_vtype tt;
} mrb_value;
```

`mrb_value`構造体は値とその値のデータ型をもつ。`enum mrb_vtype`には`MRB_TT_FIXNUM`とか`MRB_TT_STRING`などが入る。`value`と`tt`は適切な組み合わせにする必要があるはず。

`mrb_value`は`MRB_NAN_BOXING`が定義されているかどうかでその定義が変わるんだけど、`MRB_NAN_BOXING`はmrbconf.hでコメントアウトされていたので、`mrb_value`のデフォルトの定義は上のようになる。

```
// include/mrbconf.h:23

/* represent mrb_value in boxed double; conflict with MRB_USE_FLOAT */
//#define MRB_NAN_BOXING
```

どういうときにこれを使うのかはまだよくわかってない。

## mrb\_valueとデータ型の変換

int型、char型などと`mrb_value`を変換する方法も調べた。まず、変換する関数によく使われている`mrb_value`構造体に値をセットするマクロがある。

```
// include/mruby/value.h:53

#define MRB_SET_VALUE(o, ttt, attr, v) do {\
  (o).tt = ttt;\
  (o).attr = v;\
} while (0)
```

これを使って変換する関数が実装されているっぽい。とりあえず見つけたのは以下の通り。

`int` -\> `mrb_value`

```
// include/mruby/value.h:205

static inline mrb_value
mrb_fixnum_value(mrb_int i)
{
  mrb_value v;

  MRB_SET_VALUE(v, MRB_TT_FIXNUM, value.i, i);
  return v;
}
```

`mrb_value` -\> `int`

```
// include/mruby/value.h:145

#define mrb_fixnum(o) (o).value.i
```

`float` -\> `mrb_value`

```
// include/mruby/value.h:58

static inline mrb_value
mrb_float_value(mrb_float f)
{
  mrb_value v;

  MRB_SET_VALUE(v, MRB_TT_FLOAT, value.f, f);
  return v;
}
```

`mrb_value` -\> `float`

```
// include/mruby/value.h:51

#define mrb_float(o) (o).value.f
```

`char[]` -\> `mrb_value`

```
// src/string.c:670

char *
mrb_string_value_ptr(mrb_state *mrb, mrb_value ptr)
{
  mrb_value str = mrb_str_to_str(mrb, ptr);
  return RSTRING_PTR(str);
}
```

`char[]` -\> `mrb_value`

```
// src/string.c:232

mrb_value
mrb_str_new(mrb_state *mrb, const char *p, size_t len)
{
  struct RString *s;

  s = str_new(mrb, p, len);
  return mrb_obj_value(s);
}
```
