import * as path from "path";
import { type MetaFunction } from "react-router";
import Link from "~/components/link";
import type * as Route from "./+types.home";

export function loader() {
  const posts = import.meta.glob<Post>("../../../contents/posts/**/*.md", {
    eager: true,
  });
  const attributes: PostAttribute[] = Object.keys(posts)
    .map((postPath) => {
      const dir = path.dirname(postPath);
      const id = parseInt(dir.split("/").pop()!);
      const { attributes } = posts[postPath];
      return { id, ...attributes };
    })
    .sort((a, b) => b.id - a.id);
  return { attributes };
}

export const meta: MetaFunction = () => {
  return [
    { title: "Naoto Kaneko's posts" },
    {
      name: "description",
      content: "Naoto Kanekoが書いたブログ記事の一覧ページです。",
    },
    { property: "og:title", content: "Naoto Kaneko's posts" },
    {
      property: "og:description",
      content: "Naoto Kanekoが書いたブログ記事の一覧ページです。",
    },
    { property: "og:type", content: "blog" },
    { property: "twitter:card", content: "summary" },
    { property: "twitter:site", content: "@naoty_k" },
    { property: "twitter:title", content: "Naoto Kaneko's posts" },
    {
      property: "twitter:description",
      content: "Naoto Kanekoが書いたブログ記事の一覧ページです。",
    },
  ];
};

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <h1 className="border-b border-rails-border-main pb-3 text-3xl font-bold">
        Posts
      </h1>
      <ul className="list-disc pl-6">
        {loaderData.attributes.map((attribute) => (
          <li key={attribute.id}>
            <Link href={`/posts/${attribute.id}`}>{attribute.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
