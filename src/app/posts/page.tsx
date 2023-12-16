import { Metadata } from "next"
import { allPosts } from "contentlayer/generated"
import Posts from '@/app/posts/posts'
import Link from "@/components/link"

export default function Page() {
  const posts = allPosts.sort((a, b) => a.time > b.time ? -1 : 1)

  const postCountsWithYear = posts.reduce<[number, number][]>((result, post) => {
    const index = result.findIndex(entry => entry[0] === post.year)
    if (index !== -1) {
      result[index][1]++
    } else {
      result.push([post.year, 1])
    }
    return result
  }, [])

  return (
    <main className='grid grid-cols-mobile md:grid-cols-desktop grid-rows-mobile md:grid-rows-desktop'>
      <header className='container col-start-1 col-span3 row-start-1 md:col-span-1 md:col-start-2 md:row-start-2 max-md:fixed max-md:bg-white/80 max-md:backdrop-blur-sm pb-4 max-md:px-4 max-md:pt-4 md:pb-8'>
        <h1 className='text-3xl font-bold'>
          Posts
        </h1>
      </header>
      <Posts posts={posts} postCountsWithYear={postCountsWithYear} />
      <footer className='col-start-2 row-start-4 flex gap-2 container border-t pt-4 md:pt-8'>
        <Link href='/'>Top</Link>
        <span>/</span>
        <span className='text-slate-500'>Posts</span>
        <span className='ml-auto'>
          <Link href='/shogi' className='mx-2'>
            将棋メモ
          </Link>
          <a href='/posts/feed.xml' className='underline hover:text-slate-500 transition'>
            RSS
          </a>
        </span>
      </footer>
    </main>
  )
}

export const metadata: Metadata = {
  title: 'Posts',
  description: 'Naoto Kanekoが過去に書いた記事の一覧ページです。',
}
