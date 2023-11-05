import Link from "next/link"
import { allPosts } from "contentlayer/generated"
import { format, parseISO } from "date-fns"

export default function Page() {
  const sorted = allPosts.sort((a, b) => a.time > b.time ? -1 : 1)

  return (
    <main className='col-start-2 row-start-2 container'>
      <h1 className='text-3xl font-bold mb-8'>
        Posts
      </h1>
      <ul className='flex flex-col space-y-2'>
        {sorted.map(post => (
          <li key={post.id} className='flex flex-row space-x-2 items-center'>
            <span className='font-mono text-sm'>
              {format(parseISO(post.time), 'y-MM-dd')}
            </span>
            <Link href={`/posts/${post.id}`} className='underline'>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
      <hr className='my-8' />
      <footer className='flex gap-2'>
        <Link href='/' className='underline'>Top</Link>
        <span>/</span>
        <span className='text-slate-500'>Posts</span>
      </footer>
    </main>
  )
}
