import { format, parseISO } from 'date-fns'
import Content from '@/components/content'
import { allPosts } from 'contentlayer/generated'

export default function Post({ params }: { params: { id: string } }) {
  const post = allPosts.find((post) => post._raw.flattenedPath === `posts/${params.id}/post`)

  if (post == null) {
    return null
  }

  return (
    <main className='col-start-2 row-start-2 container'>
      <article>
        <header>
          <h1 className='text-3xl font-bold mb-4'>
            {post.title}
          </h1>
          <p className='mb-8'>
            {format(parseISO(post.time), 'y-MM-dd')}
          </p>
        </header>
        <Content dangerouslySetInnerHTML={{ __html: post.body.html }}></Content>
      </article>
    </main>
  )
}
