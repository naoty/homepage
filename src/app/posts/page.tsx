import { allPosts } from "contentlayer/generated"
import { format, parseISO } from "date-fns"
import Link from "@/components/link"
import FilterButton from "@/components/filter-button"

export default function Page() {
  const posts = allPosts.sort((a, b) => a.time > b.time ? -1 : 1)

  const postCountsAndYear = posts.reduce<[number, number][]>((result, post) => {
    const index = result.findIndex(entry => entry[0] === post.year)
    if (index !== -1) {
      result[index][1]++
    } else {
      result.push([post.year, 1])
    }
    return result
  }, [])

  return (
    <>
      <header className='col-start-2 row-start-2 container'>
        <h1 className='text-3xl font-bold mb-8'>
          Posts
        </h1>
      </header>
      <section className='col-start-2 row-start-3 container pb-8 border-b'>
        <ul className='flex flex-col space-y-2'>
          {posts.map(post => (
            <li key={post.id} className='flex flex-row space-x-2 items-center'>
              <span className='font-mono text-sm'>
                {post.formattedTime}
              </span>
              <Link href={`/posts/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </section>
      <nav className='col-start-3 row-start-3 container'>
        <ul className='flex flex-col space-y-2'>
          {postCountsAndYear.map(([year, count]) => (
            <li key={year}>
              <FilterButton>{`${year} (${count})`}</FilterButton>
            </li>
          ))}
        </ul>
      </nav>
      <footer className='col-start-2 row-start-4 flex gap-2 container pt-8'>
        <Link href='/'>Top</Link>
        <span>/</span>
        <span className='text-slate-500'>Posts</span>
      </footer>
    </>
  )
}
