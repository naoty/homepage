import { format, parseISO } from "date-fns"
import { Post } from 'contentlayer/generated'
import Link from "@/components/link"

export default function TaggedPosts({ tag, posts }: { tag: string, posts: Post[] }) {
  const sorted = posts.sort((a, b) => a.time > b.time ? -1 : 1)

  return (
    <main className='grid grid-cols-mobile md:grid-cols-desktop grid-rows-mobile md:grid-rows-desktop'>
      <header className='col-start-2 row-start-2 container'>
        <h1 className='text-3xl font-bold mb-4 md:mb-8'>
          #{tag}
        </h1>
      </header>
      <section className='col-start-2 row-start-3 container pb-4 md:pb-8'>
        <ul className='flex flex-col space-y-2'>
          {sorted.map(post => (
            <li key={post.id} className='flex flex-row space-x-2 items-center'>
              <span className='font-mono text-sm'>
                {post.formattedTime}
              </span>
              <Link href={`/posts/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </section>
      <footer className='col-start-2 row-start-4 flex gap-2 container border-t pt-4 md:pt-8'>
        <Link href='/'>Top</Link>
        <span>/</span>
        <Link href='/posts'>Posts</Link>
        <span>/</span>
        <span className='text-slate-500'>#{tag}</span>
        <a href='/posts/feed.xml' className='ml-auto underline hover:text-slate-500 transition'>
          RSS
        </a>
      </footer>
    </main>
  )
}
