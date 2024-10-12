import Container from "~/components/container";
import type * as Route from "./+types.post";
import classes from "./post.module.css";

export async function loader({ params }: Route.LoaderArgs) {
  // ref: https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#imports-must-start-with--or-
  return await import(`../../../contents/posts/${params.id}/post.md`);
}

export default function Post({
  loaderData: { attributes, html },
}: Route.ComponentProps) {
  return (
    <main className="grid grid-cols-8 gap-x-6 py-6">
      <Container className="col-span-4 col-start-3">
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
      </Container>
    </main>
  );
}
