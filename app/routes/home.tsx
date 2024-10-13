import { type MetaFunction } from "react-router";
import Container from "~/components/container";
import Link from "~/components/link";
import classes from "~/content.module.css";
import { attributes, html } from "~/pages/home.md";

export const meta: MetaFunction = () => {
  return [
    { title: attributes.title },
    { property: "og:title", content: attributes.title },
    ...(attributes.description
      ? [
          { name: "description", content: attributes.description },
          { property: "og:description", content: attributes.description },
        ]
      : []),
  ];
};

export default function Home() {
  return (
    <main className="grid grid-cols-8 gap-x-6 pt-6">
      <Container className="col-span-4 col-start-3">
        <h1 className="border-b border-rails-border-main pb-3 text-3xl font-bold">
          Naoto Kaneko
        </h1>
        <article
          className={classes.post}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Container>
      <nav className="col-span-1 col-start-7 space-y-3 pt-6">
        <h2 className="border-b border-rails-border-main pb-1 font-bold">
          Links
        </h2>
        <ul>
          <li>
            <Link href="/posts" className="text-sm">
              Posts
            </Link>
          </li>
          <li>
            <Link href="https://x.com/naoty_k" className="text-sm">
              X
            </Link>
          </li>
          <li>
            <Link href="https://github.com/naoty" className="text-sm">
              GitHub
            </Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
