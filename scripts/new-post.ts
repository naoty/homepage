import * as path from 'path'
import * as fs from 'fs'
import * as process from 'process'
import * as child_process from 'child_process'
import format from 'date-fns/format'

const rootDir = path.dirname(__dirname)
const postsDir = path.join(rootDir, 'contents/posts')
const postPaths = fs.readdirSync(postsDir)
const ids = postPaths
  .map(postPath => path.basename(postPath))
  .map(id => Number(id))
  .sort((a, b) => b - a)
const nextId = ids[0] + 1

const newPostPath = path.join(postsDir, `${nextId}`)
if (fs.existsSync(newPostPath)) {
  console.error(`${newPostPath} already exists.`)
  process.exit(1)
}
fs.mkdirSync(newPostPath)

const newFilePath = path.join(newPostPath, 'post.md')
const fd = fs.openSync(newFilePath, 'w')
fs.writeFileSync(fd, `---
title: New post
time: ${format(new Date(), 'yyyy-MM-dd HH:mm')}
---


`)

child_process.execFile('code', [newFilePath])
