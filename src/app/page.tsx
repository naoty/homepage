import { allPages } from 'contentlayer/generated'

export default function Home() {
  const page = allPages.find((page) => page._raw.flattenedPath === 'pages/home')

  return (
    <main className='col-start-2 row-start-2 container'>
      <article className='prose max-w-none' dangerouslySetInnerHTML={{ __html: page!.body.html }}>
      </article>
    </main>
  )
}
