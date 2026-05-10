'use client'

import { Button } from '@/components/ui/button'
import { LogOutIcon } from 'lucide-react'

export function LogoutButton() {
   async function onLogout() {
      try {
         const response = await fetch('/api/admin/auth/logout', { method: 'POST' })
         if (response.status === 200) window.location.reload()
      } catch (error) {
         console.error({ error })
      }
   }

   return (
      <Button
         variant="ghost"
         size="icon"
         onClick={onLogout}
         className="h-7 w-7 rounded-none border border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground"
      >
         <LogOutIcon className="h-3.5 w-3.5" />
      </Button>
   )
}