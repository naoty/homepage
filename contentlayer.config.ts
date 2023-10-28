import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Page = defineDocumentType(() => ({
  name: 'Page',
  filePathPattern: 'pages/**/*.md',
  fields: {},
  computedFields: {}
}))

export default makeSource({ contentDirPath: './contents', documentTypes: [Page] })
