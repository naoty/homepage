import Link from "next/link"
import { format, parseISO } from "date-fns"
import { Post } from 'contentlayer/generated'

export default function TaggedPosts({ tag, posts }: { tag: string, posts: Post[] }) {
  const sorted = posts.sort((a, b) => a.time > b.time ? -1 : 1)

  return (
    <main className='col-start-2 row-start-2 container'>
      <h1 className='text-3xl font-bold mb-8'>
        #{tag}
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
    </main>
  )
}
