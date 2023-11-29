'use client'

import { useMDXComponent } from 'next-contentlayer/hooks'
import type { MDXComponents } from 'mdx/types'
import { KifuPlayer } from '@naoty/kifu-player'
import { Post } from 'contentlayer/generated'
import Content from '@/components/content'
import Link from '@/components/link'

import '@naoty/kifu-player/dist/style.css'

export default function Post({ post }: { post: Post }) {
  const MDXContent = useMDXComponent(post.body.code)

  return (
    <>
      <header className='col-start-2 row-start-2 container'>
        <h1 className='text-3xl font-bold mb-4'>
          {post.title}
        </h1>
        <p className='flex gap-2 text-neutral-500 mb-8'>
          <span>{post.formattedTime}</span>
          {post.tags.map(tag => (
            <Link key={tag} href={`/posts/${tag}`}>
              #{tag}
            </Link>
          ))}
        </p>
      </header>
      <Content className='col-start-2 row-start-3 container pb-4 md:pb-8'>
        <MDXContent components={mdxComponents} />
      </Content>
      <footer className='col-start-2 row-start-4 flex gap-2 container border-t pt-4 md:pt-8'>
        <Link href='/'>Top</Link>
        <span>/</span>
        <Link href='/posts'>Posts</Link>
        <span>/</span>
        <span className='text-slate-500'>{post.id}</span>
        <a href='/posts/feed.xml' className='ml-auto underline hover:text-slate-500 transition'>
          RSS
        </a>
      </footer>
    </>
  )
}

const mdxComponents: MDXComponents = {
  MyComponent: () => <div>Hello World!</div>,
  KifuPlayer: ({ sfen }: { sfen: string }) => <KifuPlayer sfen={sfen} />
}
