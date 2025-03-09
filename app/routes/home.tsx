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
    <div className="divide-border flex flex-col divide-y md:flex-row md:divide-x">
      <div className="bg-primary flex-1 p-4 md:min-h-screen md:p-12">
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
      <nav className="bg-secondary h-full w-full space-y-4 px-4 py-4 md:min-h-screen md:w-3xs md:py-12">
        <h2 className="text-xl">Links</h2>
        <ul className="flex flex-row gap-x-2 md:flex-col md:gap-y-1">
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
