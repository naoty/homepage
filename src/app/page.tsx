import Content from './content.md'

export default function Home() {
  return (
    <main className='col-start-2 row-start-2 container'>
      <article className='prose max-w-none'>
        <Content />
      </article>
    </main>
  )
}
