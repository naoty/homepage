import { MetaFunction } from "react-router";
import classes from "~/content.module.css";
import type * as Route from "./+types.post";

type Post = {
  attributes: Frontmatter;
  html: string;
};

export async function loader({ params }: Route.LoaderArgs): Promise<Post> {
  // ref: https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#imports-must-start-with--or-
  return await import(`../../../contents/posts/${params.id}/post.md`);
}

export const meta: MetaFunction<typeof loader> = (args) => {
  // react-rouer v7.0.0-pre.0時点ではmetaの型を生成する手段がないため、手作業で定義する
  const post = args.data as Post;
  return [
    { title: post.attributes.title },
    { name: "author", content: "Naoto Kaneko" },
    { property: "og:title", content: post.attributes.title },
    { property: "og:type", content: "article" },
    { property: "twitter:card", content: "summary" },
    { property: "twitter:site", content: "@naoty_k" },
    { property: "twitter:title", content: post.attributes.title },
    ...(post.attributes.description
      ? [
          { name: "description", content: post.attributes.description },
          { property: "og:description", content: post.attributes.description },
          {
            property: "twitter:description",
            content: post.attributes.description,
          },
        ]
      : []),
  ];
};

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
