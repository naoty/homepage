import { allShogiNotes } from "contentlayer/generated"
import { notFound } from "next/navigation"
import Link from "@/components/link"
import { Metadata } from "next"
import Body from "./body"

export default function ShogiNote({ params }: { params: { slug: string } }) {
  const note = allShogiNotes.find(note => note.id === params.slug)

  if (note == null) {
    notFound()
  } 

  return (
    <main className='grid grid-cols-mobile md:grid-cols-shogi-note-desktop grid-rows-mobile md:grid-rows-desktop'>
      <header className='col-start-2 row-start-2 container'>
        <h1 className='text-3xl font-bold mb-4'>
          {note.title}
        </h1>
        <p className='flex gap-2 text-neutral-500 mb-8'>
          <span>{note.formattedTime}</span>
          {note.tags.map(tag => (
            <span key={tag}>#{tag}</span>
          ))}
        </p>
      </header>
      <Body code={note.body.code} className='col-start-2 row-start-3' />
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

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const note = allShogiNotes.find(note => note.id === params.slug)

  if (note == null) {
    return {}
  }

  return {
    title: note.title,
  }
}
