import * as path from "path";
import Link from "~/components/link";
import { Route } from "./+types/home";

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

  const attributesByYear = attributes.reduce<Map<number, PostAttribute[]>>(
    (result, attribute) => {
      const timestamp = Date.parse(attribute.time);
      const year = new Date(timestamp).getFullYear();

      const attributes = result.get(year) ?? [];
      result.set(year, [...attributes, attribute]);

      return result;
    },
    new Map(),
  );

  const sortedAttributesByYear = Array.from(attributesByYear.entries()).sort(
    (a, b) => b[0] - a[0],
  );

  return { attributes, sortedAttributesByYear };
}

export const meta = () => {
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
    <main className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-3xl font-bold">Posts</h1>
      <div className="space-y-4">
        {loaderData.sortedAttributesByYear.map(([year, attributes]) => (
          <section key={year} className="space-y-2">
            <h2 className="border-border border-b text-lg">{year}</h2>
            <ul className="space-y-1 pl-6">
              {attributes.map((attribute) => (
                <li key={attribute.id} className="list-disc">
                  <Link href={`/posts/${attribute.id}`} className="text-link">
                    {attribute.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
