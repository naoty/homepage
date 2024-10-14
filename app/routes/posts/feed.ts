import { Feed } from "feed";

export async function loader() {
  const feed = new Feed({
    title: "Naoto Kaneko's posts",
    description: "Naoto Kanekoが書いたブログ記事のRSSフィードです。",
    id: "https://naoty.dev",
    link: "https://naoty.dev/posts",
    copyright: "All rights reserved 2024, Naoto Kaneko",
  });
  return new Response(feed.rss2(), {
    headers: { "Content-Type": "application/xml" },
  });
}
