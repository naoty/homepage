import * as path from "path";
import Container from "~/components/container";
import Link from "~/components/link";
import type * as Route from "./+types.posts";

interface Post {
  attributes: Frontmatter;
  html: string;
}

interface Frontmatter {
  title: string;
  time: string;
  tags: string[];
}

interface PostAttribute {
  id: number;
  title: string;
  time: string;
  tags: string[];
}

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

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main className="grid grid-cols-8 gap-x-6 py-6">
      <Container className="col-span-4 col-start-3">
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
      </Container>
    </main>
  );
}
