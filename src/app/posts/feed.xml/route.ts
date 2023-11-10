import RSS from 'rss'
import { allPosts } from 'contentlayer/generated'

export async function GET(request: Request) {
  const posts = allPosts.sort((a, b) => a.time > b.time ? -1 : 1)

  const feed = new RSS({
    title: 'naoty.dev',
    description: 'Naoto Kanekoが書いた記事のフィードです。',
    site_url: 'https://naoty.dev',
    feed_url: 'https://naoty.dev/posts/feed.xml',
    image_url: 'https://naoty.dev/icon.png',
    pubDate: posts[0].time,
  })

  for (const post of posts) {
    feed.item({
      title: post.title,
      description: post.description ?? '',
      url: `https://naoty.dev/posts/${post.id}`,
      date: post.time,
      categories: post.tags,
    })
  }

  return new Response(feed.xml(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
