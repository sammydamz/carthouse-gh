import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

export const uploadRouter = {
   carImage: f({ image: { maxFileSize: '4MB', maxFileCount: 10 } }, { awaitServerData: false })
      .onUploadComplete(({ file }) => {
         console.log('Upload complete:', file.ufsUrl)
         return { url: file.ufsUrl }
      }),
} satisfies FileRouter

export type UploadRouter = typeof uploadRouter
