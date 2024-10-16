import { type MetaFunction } from "react-router";
import Container from "~/components/container";
import Link from "~/components/link";
import classes from "~/content.module.css";
import { attributes, html } from "~/pages/home.md";

export const meta: MetaFunction = () => {
  return [
    { title: attributes.title },
    { property: "og:title", content: attributes.title },
    { property: "og:type", content: "website" },
    { property: "twitter:card", content: "summary" },
    { property: "twitter:site", content: "@naoty_k" },
    { property: "twitter:title", content: attributes.title },
    ...(attributes.description
      ? [
          { name: "description", content: attributes.description },
          { property: "og:description", content: attributes.description },
          { property: "twitter:description", content: attributes.description },
        ]
      : []),
  ];
};

export default function Home() {
  return (
    <main className="grid grid-cols-12 gap-x-6 py-6">
      <Container className="col-span-10 col-start-2 md:col-span-6 md:col-start-4">
        <h1 className="border-b border-rails-border-main pb-3 text-3xl font-bold">
          Naoto Kaneko
        </h1>
        <article
          className={classes.post}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Container>
      <nav className="col-span-10 col-start-2 space-y-3 pt-6 md:col-span-2 md:col-start-10">
        <h2 className="border-b border-rails-border-main pb-1 font-bold">
          Links
        </h2>
        <ul className="flex flex-row space-x-2 md:flex-col md:space-x-0">
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
