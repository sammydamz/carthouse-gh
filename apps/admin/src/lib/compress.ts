import imageCompression from 'browser-image-compression'

export async function compressImage(file: File): Promise<File> {
   if (!file.type.startsWith('image/')) return file

   const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp' as const,
   }

   const compressed = await imageCompression(file, options)
   const newName = file.name.replace(/\.[^.]+$/, '.webp')
   return new File([compressed], newName, { type: 'image/webp' })
}
