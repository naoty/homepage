import Link from "~/components/link";
import { Route } from "./+types/post";

export async function loader({ params }: Route.LoaderArgs): Promise<Post> {
  // ref: https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#imports-must-start-with--or-
  return await import(`../../../contents/posts/${params.id}/post.md`);
}

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: data.attributes.title },
    { name: "author", content: "Naoto Kaneko" },
    { property: "og:title", content: data.attributes.title },
    { property: "og:type", content: "article" },
    { property: "twitter:card", content: "summary" },
    { property: "twitter:site", content: "@naoty_k" },
    { property: "twitter:title", content: data.attributes.title },
    ...(data.attributes.description
      ? [
          { name: "description", content: data.attributes.description },
          { property: "og:description", content: data.attributes.description },
          {
            property: "twitter:description",
            content: data.attributes.description,
          },
        ]
      : []),
  ];
}

export default function Post({
  loaderData: { attributes, html },
}: Route.ComponentProps) {
  return (
    <div className="divide-border dark:divide-dark-border flex flex-col divide-y md:flex-row md:divide-x">
      <div className="bg-primary dark:bg-dark-primary flex-1 p-4 md:min-h-screen md:p-12">
        <main className="mx-auto max-w-2xl space-y-8">
          <header className="space-y-1">
            <h1 className="bg-black text-2xl font-bold text-white dark:bg-white dark:text-black">
              {attributes.title}
            </h1>
            <div className="flex flex-row gap-x-2 text-sm">
              <time dateTime={attributes.time}>{attributes.time}</time>
              {(attributes.tags ?? []).map((tag) => (
                <Link key={tag} href={`/posts?tag=${tag}`}>
                  #{tag}
                </Link>
              ))}
            </div>
          </header>
          <article
            className="post"
            dangerouslySetInnerHTML={{ __html: html }}
          />
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
      </nav>
    </div>
  );
}
