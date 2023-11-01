import Content from '@/components/content'
import { allPages } from 'contentlayer/generated'

export default function Home() {
  const page = allPages.find((page) => page._raw.flattenedPath === 'pages/home')

  if (page == null) {
    return null
  }

  return (
    <main className='col-start-2 row-start-2 container'>
      <Content dangerouslySetInnerHTML={{ __html: page.body.html }}></Content>
    </main>
  )
}
