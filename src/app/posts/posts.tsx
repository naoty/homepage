'use client'

import { useSearchParams } from "next/navigation"
import { Post } from "contentlayer/generated"
import Link from "@/components/link"
import FilterButton from "@/components/filter-button"

type Props = {
  posts: Post[]
  postCountsWithYear: [number, number][]
}

export default function Posts({ posts, postCountsWithYear }: Props) {
  const searchParams = useSearchParams()

  let filtered = posts

  if (searchParams.has('year')) {
    const year = Number(searchParams.get('year'))
    filtered = filtered.filter(post => post.year === year)
  }
  
  return (
    <>
      <section className='col-start-2 row-start-3 container pb-8 border-b'>
        <ul className='flex flex-col space-y-2'>
          {filtered.map(post => (
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
          {postCountsWithYear.map(([year, count]) => {
            const yearParam = Number(searchParams.get('year'))
            return (
              <li key={year}>
                <FilterButton
                  href={year === yearParam ? `/posts` : `/posts?year=${year}`}
                  active={year === yearParam}
                >
                  {`${year} (${count})`}
                </FilterButton>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}
