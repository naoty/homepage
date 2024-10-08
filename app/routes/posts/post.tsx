import Container from "~/components/container";
import type * as Route from "./+types.post";

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
        <header>
          <h1 className="text-2xl font-bold">{attributes.title}</h1>
        </header>
        <article dangerouslySetInnerHTML={{ __html: html }} />
      </Container>
    </main>
  );
}
