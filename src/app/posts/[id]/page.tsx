import dynamic from "next/dynamic"

export default function Post({ params }: { params: { id: string } }) {
  const Content = dynamic(() => import(`@/contents/app/posts/${params.id}/post.md`))

  return (
    <main className='col-start-2 row-start-2 container'>
      <article className='prose'>
        <Content />
      </article>
    </main>
  )
}
