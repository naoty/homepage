import classes from "~/content.module.css";
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
    <>
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">{attributes.title}</h1>
        <p className="text-sm text-rails-text-sub">
          <time dateTime={attributes.time}>{attributes.time}</time>
        </p>
      </header>
      <article
        className={classes.post}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
