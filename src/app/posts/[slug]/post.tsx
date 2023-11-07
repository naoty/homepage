import { format, parseISO } from 'date-fns'
import { Post } from 'contentlayer/generated'
import Content from '@/components/content'
import Link from '@/components/link'

export default function Post({ post }: { post: Post }) {
  return (
    <>
      <header className='col-start-2 row-start-2 container'>
        <h1 className='text-3xl font-bold mb-4'>
          {post.title}
        </h1>
        <p className='flex gap-2 mb-8 text-neutral-500'>
          <span>{post.formattedTime}</span>
          {post.tags.map(tag => (
            <Link key={tag} href={`/posts/${tag}`}>
              #{tag}
            </Link>
          ))}
        </p>
      </header>
      <Content
        dangerouslySetInnerHTML={{ __html: post.body.html }}
        className='col-start-2 row-start-3 container pb-8 border-b'
      />
      <footer className='col-start-2 row-start-4 flex gap-2 container pt-8'>
        <Link href='/'>Top</Link>
        <span>/</span>
        <Link href='/posts'>Posts</Link>
        <span>/</span>
        <span className='text-slate-500'>{post.id}</span>
      </footer>
    </>
  )
}
