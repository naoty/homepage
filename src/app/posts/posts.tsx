'use client'

import { useSearchParams } from "next/navigation"
import { Post } from "contentlayer/generated"
import { roboto } from '@/app/fonts'
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
      <section className='col-start-2 row-start-3 container pb-4 md:pb-8 md:pr-4'>
        <ul className='flex flex-col space-y-2'>
          {filtered.map(post => (
            <li key={post.id} className='flex flex-row space-x-2 items-center'>
              <span className={`text-sm leading-[21px] ${roboto.className}`}>
                {post.formattedTime}
              </span>
              <Link href={`/posts/${post.id}`} className='flex-1'>
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <nav className='max-md:hidden md:col-start-3 md:row-start-3 container'>
        <ul className='flex flex-col space-y-2'>
          {postCountsWithYear.map(([year, count]) => {
            const yearParam = Number(searchParams.get('year'))
            return (
              <li key={year}>
                <FilterButton
                  href={year === yearParam ? `/posts` : `/posts?year=${year}`}
                  active={year === yearParam}
                  className={`${roboto.className}`}
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
