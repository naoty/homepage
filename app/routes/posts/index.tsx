import clsx from "clsx";
import * as path from "path";
import Link from "~/components/link";
import { Route } from "./+types";

export function loader({ request }: Route.LoaderArgs) {
  const searchParams = new URL(request.url).searchParams;
  const selectedTags = searchParams.getAll("tag");

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

  const filteredAttributes =
    selectedTags.length === 0
      ? attributes
      : attributes
          .filter(
            (attribute) =>
              attribute.tags !== undefined && attribute.tags.length > 0,
          )
          .filter((attribute) =>
            selectedTags.every((tag) => attribute.tags?.includes(tag)),
          );

  const attributesByYear = filteredAttributes.reduce<
    Map<number, PostAttribute[]>
  >((result, attribute) => {
    const timestamp = Date.parse(attribute.time);
    const year = new Date(timestamp).getFullYear();

    const attributes = result.get(year) ?? [];
    result.set(year, [...attributes, attribute]);

    return result;
  }, new Map());

  const sortedAttributesByYear = Array.from(attributesByYear.entries()).sort(
    (a, b) => b[0] - a[0],
  );

  const tagsWithCount = Array.from(
    filteredAttributes
      .flatMap((attribute) => attribute.tags ?? [])
      .filter((tag) => tag !== undefined && tag !== "")
      .reduce<Map<string, number>>((result, tag) => {
        const count = result.get(tag) ?? 0;
        result.set(tag, count + 1);
        return result;
      }, new Map())
      .entries(),
  ).sort((a, b) => b[1] - a[1]);

  return { sortedAttributesByYear, tagsWithCount, selectedTags };
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

export default function Home({
  loaderData: { sortedAttributesByYear, tagsWithCount, selectedTags },
}: Route.ComponentProps) {
  const buildTagParams = (tag: string) => {
    const newParam = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    return new URLSearchParams(newParam.map((tag) => ["tag", tag]));
  };

  return (
    <div className="divide-border dark:divide-dark-border flex flex-col divide-y md:flex-row md:divide-x">
      <div className="bg-primary dark:bg-dark-primary flex-1 p-4 md:min-h-screen md:p-12">
        <main className="mx-auto max-w-2xl space-y-8">
          <h1 className="text-3xl font-bold">Posts</h1>
          <div className="space-y-4">
            {sortedAttributesByYear.map(([year, attributes]) => (
              <section key={year} className="space-y-2">
                <h2 className="border-border border-b text-lg">{year}</h2>
                <ul className="space-y-1 pl-6">
                  {attributes.map((attribute) => (
                    <li key={attribute.id} className="list-disc">
                      <Link
                        href={`/posts/${attribute.id}`}
                        className="text-link"
                      >
                        {attribute.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </main>
      </div>

      <nav className="bg-secondary dark:bg-dark-secondary w-full space-y-4 p-4 md:w-3xs md:min-h-screen md:py-12">
        <h2 className="text-xl">Links</h2>
        <ul className="flex flex-row gap-x-2 md:flex-col md:gap-y-1">
          <li>
            <Link href="/" className="text-sm">
              Top
            </Link>
          </li>
          <li>
            <Link href="/posts" className="text-sm">
              Posts
            </Link>
          </li>
        </ul>

        <h2 className="text-xl">Tags</h2>
        <div className="flex flex-wrap gap-x-2">
          {tagsWithCount.map(([tag, count]) => (
            <Link
              key={tag}
              href={`/posts?${buildTagParams(tag).toString()}`}
              className={clsx(
                "text-sm",
                selectedTags.includes(tag) &&
                  "bg-link text-white no-underline dark:text-white",
              )}
            >
              {tag}({count})
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
