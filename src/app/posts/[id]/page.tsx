import { notFound } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import Content from '@/components/content'
import { allPosts } from 'contentlayer/generated'

export default function Post({ params }: { params: { id: string } }) {
  const post = allPosts.find((post) => post._raw.flattenedPath === `posts/${params.id}/post`)

  if (post == null) {
    notFound()
  }

  return (
    <main className='col-start-2 row-start-2 container'>
      <article>
        <header>
          <h1 className='text-3xl font-bold mb-4'>
            {post.title}
          </h1>
          <p className='flex gap-2 mb-8'>
            <span>{format(parseISO(post.time), 'y-MM-dd')}</span>
            {post.tags.map(tag => (
              <a className='underline' href=''>#{tag}</a>
            ))}
          </p>
        </header>
        <Content dangerouslySetInnerHTML={{ __html: post.body.html }}></Content>
      </article>
    </main>
  )
}
