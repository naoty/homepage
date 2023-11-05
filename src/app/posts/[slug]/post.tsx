import { format, parseISO } from 'date-fns'
import { Post } from 'contentlayer/generated'
import Content from '@/components/content'
import Link from '@/components/link'

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
              <Link key={tag} href={`/posts/${tag}`}>
                #{tag}
              </Link>
            ))}
          </p>
        </header>
        <Content dangerouslySetInnerHTML={{ __html: post.body.html }}></Content>
        <hr className='my-8' />
        <footer className='flex gap-2'>
          <Link href='/'>Top</Link>
          <span>/</span>
          <Link href='/posts'>Posts</Link>
          <span>/</span>
          <span className='text-slate-500'>{post.id}</span>
        </footer>
      </article>
    </main>
  )
}
