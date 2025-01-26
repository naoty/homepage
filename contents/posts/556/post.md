---
title: オブジェクトを返す引数の一部を任意にしたい
time: 2025-01-26 18:51
tags: ['typescript']
---

ある型を持つオブジェクトを生成する関数を定義する際に、そのオブジェクトの型を引数の型として利用したい。ただし、一部の引数は必須で、残りは任意としたいような場合にどのように引数の型を定義するといいか調べた。

```typescript
interface Option {
  flagA: boolean;
  flagB: boolean;
  flagC: boolean;
};

type RequiredOptionItem = "flagA" | "flagB";

/**
 * これと同じ
 * interface RequiredOption {
 *   flagA: boolean;
 *   flagB: boolean;
 * };
 */
type RequiredOption = Pick<Option, RequiredOptionItem>;

/**
 * これと同じ
 * interface OptionalOption {
 *   flagC?: boolean;
 * };
 */
type OptionalOption = Partial<Omit<Option, RequiredOptionItem>>;

/**
 * argsはこの型と同じ
 * interface Args {
 *   flagA: boolean;
 *   flagB: boolean;
 *   flagC?: boolean;
 * };
 */
function createOption(args: RequiredOption & OptionalOption) {
  return {
    flagA: args.flagA,
    flagB: args.flagB,
    flagC: args.flagC || false,
  } satisfies Option;
};
```

- `Pick<T, Keys>`は、型`T`のうち`Keys`で指定したプロパティのみを持つ部分型を表す。なので、`Pick<Option, RequiredOptionItem>`で`flagA`と`flagB`のみを持つ型を表している。
- `Omit<T, Keys>`は`Pick`の逆で、型`T`から`Keys`で指定したプロパティを除いた部分型を表す。
- `Partial<T>`は型`T`のプロパティすべてを任意にした型を表す。なので、`Partial<Omit<Option, RequiredOptionItem>>`は`RequiredOptionItem`で指定したプロパティを除いたプロパティだけを持ち、かつそれらが任意になっている型を表す。
- 引数の型には`&`で交差型にすることで、一部のプロパティが必須、残りが任意となる型を指定できる。
