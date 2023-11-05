import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Content from '@/components/content'
import { allPages } from 'contentlayer/generated'
import Link from '@/components/link'

export default function Home() {
  const page = allPages.find((page) => page._raw.flattenedPath === 'pages/home')

  if (page == null) {
    notFound()
  }

  return (
    <>
      <header className='col-start-2 row-start-2 container'>
        <h1 className='text-3xl font-bold mb-8'>
          {page.title}
        </h1>
      </header>
      <Content
        dangerouslySetInnerHTML={{ __html: page.body.html }}
        className='col-start-2 row-start-3 container pb-8 border-b'
      />
      <footer className='col-start-2 row-start-4 flex gap-4 container pt-8'>
        <a href='https://twitter.com/naoty_k' className='underline hover:text-slate-500 transition'>
          X
        </a>
        <a href='https://github.com/naoty' className='underline hover:text-slate-500 transition'>
          GitHub
        </a>
        <Link href='/posts'>Posts</Link>
      </footer>
    </>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = allPages.find((page) => page._raw.flattenedPath === 'pages/home')

  return {
    title: page?.title,
    description: page?.description,
  }
}
