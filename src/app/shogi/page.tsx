import { allShogiNotes } from "contentlayer/generated"
import { roboto } from "../fonts"
import Link from "@/components/link"
import { Metadata } from "next"

export default function ShogiNotes() {
  const notes = allShogiNotes.sort((a, b) => a.time > b.time ? -1 : 1)

  return (
    <main className='grid grid-cols-mobile md:grid-cols-desktop grid-rows-mobile md:grid-rows-desktop'>
      <header className='col-start-2 row-start-2 container'>
        <h1 className='text-3xl font-bold mb-4 pb-4 md:pb-8'>将棋メモ</h1>
      </header>
      <section className='col-start-2 row-start-3 container pb-4 max-md:pt-12 md:pb-8 md:pr-4'>
        <ul className='flex flex-col space-y-2'>
          {notes.map(note => (
            <li key={note.id} className='flex flex-row space-x-2 items-center'>
              <span className={`text-sm leading-[21px] ${roboto.className}`}>
                {note.formattedTime}
              </span>
              <Link href={`/shogi/${note.id}`}>
                {note.title}
              </Link>
              {note.tags.map(tag => (
                <span key={tag}>
                  #{tag}
                </span>
              ))}
            </li>
          ))}
        </ul>
      </section>
      <footer className='col-start-2 row-start-4 flex gap-2 container border-t pt-4 md:pt-8'>
        <Link href='/'>Top</Link>
        <span>/</span>
        <span className='text-slate-500'>将棋メモ</span>
        <span className='ml-auto'>
          <Link href='/posts'>
            Posts
          </Link>
        </span>
      </footer>
    </main>
  )
}

export const metadata: Metadata = {
  title: '将棋メモ',
  description: 'Naoto Kanekoが過去に書いた将棋メモの一覧ページです。',
}
