'use client'

import { useDropzone as useReactDropzone } from 'react-dropzone'
import { X, Upload, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { generateReactHelpers } from '@uploadthing/react'

import type { UploadRouter } from '@/lib/uploadthing'
import { compressImage } from '@/lib/compress'

const { useUploadThing } = generateReactHelpers<UploadRouter>()

interface ImageUploadProps {
   images: string[]
   onChange: (images: string[]) => void
}

export function ImageUpload({ images, onChange }: ImageUploadProps) {
   const { startUpload, isUploading } = useUploadThing('carImage', {
      onClientUploadComplete: () => {},
      onUploadError: (err) => { console.error('Upload error:', err) },
   })

   const onDrop = async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return
      const compressed = await Promise.all(acceptedFiles.map(compressImage))
      const res = await startUpload(compressed)
      if (res) {
         const urls = res.map((f) => f.ufsUrl)
         onChange([...images, ...urls])
      }
   }

   const { getRootProps, getInputProps, isDragActive } = useReactDropzone({
      onDrop,
      accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
      disabled: isUploading,
      maxFiles: 10,
   })

   const removeImage = (index: number) => {
      onChange(images.filter((_, i) => i !== index))
   }

   const moveImage = (from: number, to: number) => {
      if (to < 0 || to >= images.length) return
      const arr = [...images]
      const [item] = arr.splice(from, 1)
      arr.splice(to, 0, item)
      onChange(arr)
   }

   return (
      <div className="space-y-3">
         <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
               isDragActive ? 'border-rose-500 bg-rose-50' : 'border-input hover:border-rose-300'
            } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
         >
            <input {...getInputProps()} />
            {isUploading ? (
               <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground mb-2" />
            ) : (
               <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            )}
            <p className="text-sm text-muted-foreground">
               {isUploading ? 'Uploading...' : 'Drag & drop images here, or click to browse'}
            </p>
         </div>

         {images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
               {images.map((url, index) => (
                  <div key={url + index} className="relative group aspect-square rounded-md overflow-hidden bg-muted">
                     <img src={url} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                     <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                     >
                        <X className="h-3 w-3" />
                     </button>
                     {index === 0 && (
                        <span className="absolute bottom-1 left-1 text-[10px] bg-rose-600 text-white px-1.5 py-0.5 rounded">
                           Featured
                        </span>
                     )}
                     {images.length > 1 && (
                        <div className="absolute bottom-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button
                              type="button"
                              onClick={() => moveImage(index, index - 1)}
                              disabled={index === 0}
                              className="bg-black/60 text-white rounded-sm p-0.5 disabled:opacity-30"
                           >
                              <ChevronLeft className="h-3 w-3" />
                           </button>
                           <button
                              type="button"
                              onClick={() => moveImage(index, index + 1)}
                              disabled={index === images.length - 1}
                              className="bg-black/60 text-white rounded-sm p-0.5 disabled:opacity-30"
                           >
                              <ChevronRight className="h-3 w-3" />
                           </button>
                        </div>
                     )}
                  </div>
               ))}
            </div>
         )}
      </div>
   )
}
