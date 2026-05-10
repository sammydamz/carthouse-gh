'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function MainNav({
   className,
   ...props
}: React.HTMLAttributes<HTMLElement>) {
   const pathname = usePathname()

   const routes = [
      {
         href: `/`,
         label: 'Dashboard',
         active: pathname === `/`,
      },
      {
         href: `/products`,
         label: 'Products',
         active: pathname.includes(`/products`),
      },
      {
         href: `/categories`,
         label: 'Categories',
         active: pathname.includes(`/categories`),
      },
      {
         href: `/suppliers`,
         label: 'Suppliers',
         active: pathname.includes(`/suppliers`),
      },
      {
         href: `/orders`,
         label: 'Orders',
         active: pathname.includes(`/orders`),
      },
   ]

   return (
      <nav
         className={cn('flex items-center gap-1', className)}
         {...props}
      >
         {routes.map((route) => (
            <Link
               key={route.href}
               href={route.href}
               className={cn(
                  'px-3 py-2 text-sm transition-colors border-b-2 hover:text-primary',
                  route.active
                     ? 'border-primary font-semibold text-foreground'
                     : 'border-transparent font-normal text-muted-foreground'
               )}
            >
               {route.label}
            </Link>
         ))}
      </nav>
   )
}