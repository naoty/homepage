import { allPosts } from "contentlayer/generated"
import { format, parseISO } from "date-fns"
import Link from "@/components/link"

export default function Page() {
  const sorted = allPosts.sort((a, b) => a.time > b.time ? -1 : 1)

  return (
    <>
      <header className='col-start-2 row-start-2 container'>
        <h1 className='text-3xl font-bold mb-8'>
          Posts
        </h1>
      </header>
      <section className='col-start-2 row-start-3 container pb-8 border-b'>
        <ul className='flex flex-col space-y-2'>
          {sorted.map(post => (
            <li key={post.id} className='flex flex-row space-x-2 items-center'>
              <span className='font-mono text-sm'>
                {format(parseISO(post.time), 'y-MM-dd')}
              </span>
              <Link href={`/posts/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </section>
      <footer className='col-start-2 row-start-4 flex gap-2 container pt-8'>
        <Link href='/'>Top</Link>
        <span>/</span>
        <span className='text-slate-500'>Posts</span>
      </footer>
    </>
  )
}
