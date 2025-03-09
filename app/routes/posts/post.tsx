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
    <main className="mx-auto max-w-2xl space-y-8">
      <header className="space-y-1">
        <h1 className="bg-black text-2xl font-bold text-white dark:bg-white dark:text-black">
          {attributes.title}
        </h1>
        <p className="text-sub text-sm">
          <time dateTime={attributes.time}>{attributes.time}</time>
        </p>
      </header>
      <article className="post" dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
