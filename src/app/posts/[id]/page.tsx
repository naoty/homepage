export default function Post({ params }: { params: { id: string } }) {
  return (
    <main className='col-start-2 row-start-2 container'>
      <article className='prose'>
        <h1>Post #{params.id}</h1>
      </article>
    </main>
  )
}
