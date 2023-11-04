import { notFound } from 'next/navigation'
import { allPosts } from 'contentlayer/generated'
import Post from '@/app/posts/[slug]/post'

export default function Page({ params }: { params: { slug: string } }) {
  const post = allPosts.find((post) => post.id === params.slug)

  if (post == null) {
    notFound()
  }

  return <Post post={post} />
}
