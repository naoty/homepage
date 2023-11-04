import { notFound } from 'next/navigation'
import { allPosts } from 'contentlayer/generated'
import Post from '@/app/posts/[slug]/post'
import TaggedPosts from '@/app/posts/[slug]/tagged-posts'

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
