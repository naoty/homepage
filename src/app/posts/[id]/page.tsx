import { allPosts } from 'contentlayer/generated'

export default function Post({ params }: { params: { id: string } }) {
  const post = allPosts.find((post) => post._raw.flattenedPath === `posts/${params.id}/post`)

  if (post == null) {
    return null
  }

  return (
    <main className='col-start-2 row-start-2 container'>
      <article className='prose' dangerouslySetInnerHTML={{ __html: post.body.html }}>
      </article>
    </main>
  )
}
