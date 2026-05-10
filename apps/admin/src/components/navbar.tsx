import { MainNav } from '@/components/main-nav'
import { ThemeToggle } from '@/components/theme-toggle'
import Image from 'next/image'
import Link from 'next/link'

import { LogoutButton } from './logout-button'

export default async function Navbar() {
   return (
      <header>
         <div className="bg-primary text-primary-foreground">
            <div className="flex justify-between items-center h-9 px-6 md:px-12 lg:px-16 xl:px-24">
<span className="text-[11px] font-bold uppercase tracking-wider">
                   CarHouse GH
                </span>
               <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <LogoutButton />
               </div>
            </div>
         </div>
         <div className="border-b-2 border-primary">
            <div className="flex justify-between items-center h-14 px-6 md:px-12 lg:px-16 xl:px-24">
               <div className="flex items-center gap-8">
                  <Link href="/" className="flex items-center">
                     <Image
                        src="/ea.jpg"
                        alt="E.A. First Class Autos"
                        width={46}
                        height={40}
                        className="h-8 w-auto object-contain"
                        style={{ width: 'auto', height: 'auto' }}
                        priority
                     />
                  </Link>
                  <div className="hidden md:block h-6 w-px bg-border" />
                  <MainNav />
               </div>
               <span className="text-[10px] uppercase tracking-wider text-muted-foreground hidden lg:inline">
                  Admin Panel
               </span>
            </div>
         </div>
      </header>
   )
}
