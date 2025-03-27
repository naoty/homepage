---
title: "@types/reactを読んでpropsの型に何を使うべきか答えを出す"
time: 2025-03-26 22:00
tags: ['react']
---

コンポーネントのpropsの型は結局どれを使えばいいのかいつも迷うし、公式っぽいドキュメントも見当たらないので、[@types/react](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts)のコードを読むことにした。

# TL;DR

![propsを表す型の関係を表した図](/posts/561/type-tree.png)

- HTML要素や関数コンポーネント、クラスコンポーネントのpropsをあらわす最も汎用的な型は `ComponentProps<T>` 型なので、基本的にはこれを使えばいいはず。
- `ComponentPropsWithoutRef<T>` 型は名前のとおり `ComponentProps<T>` から `"ref"` を除いた型で、`"ref"` をpropsにもたないHTML要素をラップしたコンポーネントのpropsなんかに使うとよさそう。

# `ComponentProps<T>`

```ts
type ComponentProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> = T extends
    JSXElementConstructor<infer Props> ? Props
    : T extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[T]
    : {};
```

- 型パラメータ `T` は `JSX.IntrinsicElements` のキーまたは `JSXElementConstructor<any>` を拡張する必要がある。 `JSX.IntrinsicElements` については詳しくは後述するけど簡単に言うとHTML要素ごとのpropsの型を持つオブジェクトのことで、これのキーというのはつまりHTML要素のことを指している。 `JSXElementConstructor<any>` は関数コンポーネントまたはクラスコンポーネントのコンストラクタを表している。つまり、 `T` はHTML要素か、関数またはクラスで定義されたコンポーネントのいずれかということになる。
- 右辺の `T extends JSXElementConstructor<infer Props> ? Props : ...` の部分は、 `T` が関数またはクラスで定義されたコンポーネントだった場合は `ComponentProps<T>` はそのpropsの型を表す、ということになる。こういう三項演算子みたいな書き方は条件付き型（Conditional Types）と呼ばれるようだ。 `infer` 演算子を型パラメータにつけると `?` 以降でその型パラメータを参照できるようだ。
- `T` が関数またはクラスコンポーネントでない場合、 `JSX.IntrinsicElements` のキー、つまりHTML要素であればその要素のpropsの型が `ComponentProps<T>` の型ということになる。

まとめると、 `ComponentProps<T>` は `ComponentProps<"a">` や `ComponentProps<MyComponent>` のように使い、その型パラメータのコンポーネントのpropsを表す型ということになる。

# `ComponentPropsWithoutRef<T>`

```ts
type ComponentPropsWithoutRef<T extends ElementType> = PropsWithoutRef<ComponentProps<T>>;
```

- 型パラメータ `T` は `ElementType` を拡張している。 `ElementType` については深追いしていないけどコメントを読むかぎり、propsを受け取れるコンポーネント全般を表す型のようだ。
- `PropsWithoutRef<T>` に渡している `ComponentProps<T>` は上で見たとおり。

## `PropsWithoutRef<T>`

```ts
type PropsWithoutRef<Props> =
	Props extends any ? ("ref" extends keyof Props ? Omit<Props, "ref"> : Props) : Props;
```

- `Props extends any ? ... : ...` は一見すると常に真じゃないの？と思うのだけど、この書き方は分配的条件付き型（Distributive Conditional Types）と呼ばれるもので、ここでは `Props` が `A | B` のようなユニオン型だった場合に `A` と `B` それぞれに対して評価した型をユニオンとして結合する際に使う。何言っているのかわからないかもしれない。具体的には今回のようなケースでは `Omit<A | B, "ref">` ではなく `Omit<A, "ref"> | Omit<B, "ref">` という型にしたいときに使える書き方ということだ。
- `Props` のキーに `"ref"` が含まれていれば `"ref"` をプロパティから除いた型をあらわす。 `Props` がユニオン型であってもそれぞれの型から `"ref"` を除いた型を結合したユニオン型をあらわすということになる。

まとめると、 `ComponentPropsWithoutRef<T>` は名前の通り `T` のpropsから `"ref"` を除いた型をあらわす。

# `JSX.IntrinsicElements`

```ts
namespace JSX {
  interface IntrinsicElements {
    a: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
    abbr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    // ...
  }
}
```

- `JSX.IntrinsicElements` はinterfaceで、プロパティにHTML要素が列挙されている。各プロパティの型はHTML要素ごとのpropsの型が宣言されている。

## `DetailedHTMLProps<E, T>`

```ts
type DetailedHTMLProps<E extends HTMLAttributes<T>, T> = ClassAttributes<T> & E;
```

- `HTMLAttributes<T>` を拡張した型パラメータ `E` と `ClassAttributes<T>` を結合したインターセクション型をあらわす。
- `HTMLAttributes<T>` については後述するけど、簡単に言うとHTML要素に共通して適用できる標準的な属性を指すっぽい。
- `ClassAttributes<T>` は `key` をプロパティとしてもつ `Attributes` を拡張して  `ref` を追加した `RefAttributes<T>` と実質的に同じ。つまり `key` と `ref` のこと。

## `AnchorHTMLAttributes<T>`

```ts
interface AnchorHTMLAttributes<T> extends HTMLAttributes<T> {
  download?: any;
  href?: string | undefined;
  hrefLang?: string | undefined;
  media?: string | undefined;
  ping?: string | undefined;
  target?: HTMLAttributeAnchorTarget | undefined;
  type?: string | undefined;
  referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
}
```

- `HTMLAttributes<T>` を拡張し、そこに `href` など `<a>` タグで適用できる属性を加えたinterfaceをあらわしている。

## `HTMLAttributes<T>`

```ts
interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
  // React-specific Attributes
  defaultChecked?: boolean | undefined;
  defaultValue?: string | number | readonly string[] | undefined;
  suppressContentEditableWarning?: boolean | undefined;
  suppressHydrationWarning?: boolean | undefined;

  // Standard HTML Attributes
  accessKey?: string | undefined;
  autoCapitalize?: "off" | "none" | "on" | "sentences" | "words" | "characters" | undefined | (string & {});
  autoFocus?: boolean | undefined;
  className?: string | undefined;
  // ...
}
```

- `AriaAttributes` と `DOMAttributes<T>` を拡張し、HTMLで共通して適用できるグローバル属性を加えたinterfaceをあらわしている。
- `AriaAttributes` は名前のとおり `aria-*` 属性をもつ。
- `DOMAttributes<T>` は `children` や各種イベントハンドラーを持つinterfaceをあらわしている。

まとめると、 `JSX.IntrinsicElements` は各HTML要素のpropsをまとめたinterfaceになっており、propsの型は `DetailedHTMLProps<E, T>` であらわされる。例えば `<a>` タグのpropsである `DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>` 型はHTML要素に共通した属性と `<a>` タグ固有の属性と `ref` および `key` を含む属性をあらわしている。
