'use client'

import Content from "@/components/content"
import { KifuPlayer } from "@naoty/kifu-player"
import MultiColumns from "@/components/multi-columns"
import { allShogiNotes } from "contentlayer/generated"
import type { MDXComponents } from 'mdx/types'
import { useMDXComponent } from "next-contentlayer/hooks"
import { notFound } from "next/navigation"
import { ReactNode } from "react"

import '@naoty/kifu-player/dist/style.css'
import Column from "@/components/column"
import Link from "@/components/link"

export default function ShogiNote({ params }: { params: { slug: string } }) {
  const note = allShogiNotes.find(note => note.id === params.slug)

  if (note == null) {
    notFound()
  } 

  const MDXContent = useMDXComponent(note.body.code)

  return (
    <main className='grid grid-cols-mobile md:grid-cols-shogi-note-desktop grid-rows-mobile md:grid-rows-desktop'>
      <header className='col-start-2 row-start-2 container'>
        <h1 className='text-3xl font-bold mb-4'>
          {note.title}
        </h1>
        <p className='flex gap-2 text-neutral-500 mb-8'>
          <span>{note.formattedTime}</span>
          {note.tags.map(tag => (
            <span>#{tag}</span>
          ))}
        </p>
      </header>
      <Content className='col-start-2 row-start-3 container pb-4 md:pb-8'>
        <MDXContent components={mdxComponents} />
      </Content>
      <footer className='col-start-2 row-start-4 flex gap-2 container border-t pt-4 md:pt-8'>
        <Link href='/'>Top</Link>
        <span>/</span>
        <Link href='/shogi'>将棋メモ</Link>
        <span>/</span>
        <span className='text-slate-500'>{note.id}</span>
      </footer>
    </main>
  )
}

const mdxComponents: MDXComponents = {
  MultiColumns: ({ children }: { children: ReactNode }) => <MultiColumns>{children}</MultiColumns>,
  Column: ({ children }: { children: ReactNode }) => <Column>{children}</Column>,
  KifuPlayer: ({ sfen }: { sfen: string }) => <KifuPlayer sfen={sfen} />,
}
