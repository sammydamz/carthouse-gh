'use client'

import { Button } from '@/components/ui/button'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'

export function ThemeToggle() {
   const { resolvedTheme, setTheme } = useTheme()

   return (
      <Button
         variant="ghost"
         size="icon"
         onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
         className="h-7 w-7 rounded-none border border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground"
      >
         {resolvedTheme === 'dark' ? (
            <SunIcon className="h-3.5 w-3.5" />
         ) : (
            <MoonIcon className="h-3.5 w-3.5" />
         )}
      </Button>
   )
}
