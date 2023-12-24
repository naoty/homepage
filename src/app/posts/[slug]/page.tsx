import { notFound } from 'next/navigation'
import { allPosts } from 'contentlayer/generated'
import Post from '@/app/posts/[slug]/post'
import TaggedPosts from '@/app/posts/[slug]/tagged-posts'
import { Metadata } from 'next'

export default function Page({ params }: { params: { slug: string } }) {
  const post = allPosts.find(post => post.id === params.slug)
  if (post != null) {
    return <Post post={post} />
  }

  const taggedPosts = allPosts.filter(post => post.tags.includes(params.slug))
  if (taggedPosts.length > 0) {
    return <TaggedPosts tag={params.slug} posts={taggedPosts} />
  }

  notFound()
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = allPosts.find(post => post.id === params.slug)
  if (post != null) {
    return {
      title: post.title,
      description: post.description,
      openGraph: {
        title: post.title,
        description: post.description,
      },
      twitter: {
        title: post.title,
        description: post.description,
      },
    }
  }

  const taggedPosts = allPosts.filter(post => post.tags.includes(params.slug))
  if (taggedPosts.length > 0) {
    return {
      title: `Posts #${params.slug}`,
      description: `#${params.slug}がついた記事の一覧ページです。`,
      openGraph: {
        title: `Posts #${params.slug}`,
        description: `#${params.slug}がついた記事の一覧ページです。`,
      },
      twitter: {
        title: `Posts #${params.slug}`,
        description: `#${params.slug}がついた記事の一覧ページです。`,
      },
    }
  }

  return {}
}
