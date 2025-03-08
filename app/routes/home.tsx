import Link from "~/components/link";
import { attributes, html } from "~/pages/home.md";

export const meta = () => {
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
    <div className="divide-border flex flex-row divide-x">
      <div className="bg-primary h-screen flex-1 p-12">
        <main className="mx-auto max-w-2xl space-y-8">
          <header>
            <h1 className="text-3xl font-bold">Naoto Kaneko</h1>
          </header>
          <article
            className="post"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </main>
      </div>
      <nav className="bg-secondary h-screen w-3xs space-y-4 px-4 py-12">
        <h2 className="text-xl">Links</h2>
        <ul className="space-y-1">
          <li>
            <Link className="text-sm" href="/posts">
              Posts
            </Link>
          </li>
          <li>
            <Link className="text-sm" href="https://x.com/naoty_k">
              X
            </Link>
          </li>
          <li>
            <Link className="text-sm" href="https://github.com/naoty">
              GitHub
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
