'use client'

import { useSearchParams } from "next/navigation"
import { Post } from "contentlayer/generated"
import Link from "@/components/link"

export default function Posts({ posts }: { posts: Post[] }) {
  const searchParams = useSearchParams()

  let filtered = posts

  if (searchParams.has('year')) {
    const year = Number(searchParams.get('year'))
    filtered = filtered.filter(post => post.year === year)
  }

  return (
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
  )
}
