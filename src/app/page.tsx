import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Content from '@/components/content'
import { allPages } from 'contentlayer/generated'

export default function Home() {
  const page = allPages.find((page) => page._raw.flattenedPath === 'pages/home')

  if (page == null) {
    notFound()
  }

  return (
    <main className='col-start-2 row-start-2 container'>
      <article>
        <header>
          <h1 className='text-3xl font-bold mb-8'>
            {page.title}
          </h1>
        </header>
        <Content dangerouslySetInnerHTML={{ __html: page.body.html }}></Content>
        <hr className='my-8' />
        <footer className='flex gap-4'>
          <a href='https://twitter.com/naoty_k' className='underline'>X</a>
          <a href='https://github.com/naoty' className='underline'>GitHub</a>
          <Link href='/posts' className='underline'>Posts</Link>
        </footer>
      </article>
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = allPages.find((page) => page._raw.flattenedPath === 'pages/home')

  return {
    title: page?.title,
    description: page?.description,
  }
}
