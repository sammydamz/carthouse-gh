'use client'

import { UploadButton } from '@/components/utils/upload-button'

interface ImageUploadProps {
   value: string[]
   onChange: (value: string[]) => void
   disabled?: boolean
}

export function ImageUpload({ value = [], onChange, disabled }: ImageUploadProps) {
   return (
      <div className="space-y-4">
         <div className="flex flex-wrap gap-4">
            {value.map((url, index) => (
               <div key={index} className="relative w-24 h-24">
                  <img
                     src={url}
                     alt={`Image ${index + 1}`}
                     className="w-full h-full object-cover rounded"
                  />
                  <button
                     type="button"
                     onClick={() => onChange(value.filter((_, i) => i !== index))}
                     className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-xs"
                  >
                     X
                  </button>
               </div>
            ))}
         </div>
         <UploadButton
            endpoint="carImage"
            onClientUploadComplete={(res) => {
               const urls = res.map((r) => r.url)
               onChange([...value, ...urls])
            }}
            onUploadError={(error: Error) => {
               console.error(error)
            }}
         />
      </div>
   )
}