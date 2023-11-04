import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { Post } from 'contentlayer/generated'
import Content from '@/components/content'

export default function Post({ post }: { post: Post }) {
  return (
    <main className='col-start-2 row-start-2 container'>
      <article>
        <header>
          <h1 className='text-3xl font-bold mb-4'>
            {post.title}
          </h1>
          <p className='flex gap-2 mb-8 font-mono'>
            <span>{format(parseISO(post.time), 'y-MM-dd')}</span>
            {post.tags.map(tag => (
              <Link href={`/posts/${tag}`} className='underline'>#{tag}</Link>
            ))}
          </p>
        </header>
        <Content dangerouslySetInnerHTML={{ __html: post.body.html }}></Content>
      </article>
    </main>
  )
}
