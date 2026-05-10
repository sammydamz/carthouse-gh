import { prisma } from '@/lib/prisma'
import { getAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Package, FolderTree, Truck, ShoppingCart } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
   const admin = await getAdmin()
   if (!admin) redirect('/login')

   const [productCount, categoryCount, supplierCount, orderCount, recentOrders] = await Promise.all([
      prisma.product.count({ where: { isDeleted: false } }),
      prisma.category.count(),
      prisma.supplier.count(),
      prisma.order.count(),
      prisma.order.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
   ])

   const stats = [
      { label: 'Products', value: productCount, icon: Package },
      { label: 'Categories', value: categoryCount, icon: FolderTree },
      { label: 'Suppliers', value: supplierCount, icon: Truck },
      { label: 'Orders', value: orderCount, icon: ShoppingCart },
   ]

   return (
      <div className="flex-col">
         <div className="flex-1 pt-8 pb-12">
            <Heading title="Dashboard" description={`Welcome back, ${admin.name}`} />
            <Separator className="my-6" />

            <div className="grid gap-0 md:grid-cols-4 md:divide-x">
               {stats.map((stat) => (
                  <div key={stat.label} className="py-6 md:px-8 first:pl-0 last:pr-0">
                     <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-muted-foreground">
                           {stat.label}
                        </p>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                     </div>
                     <div className="text-3xl font-bold tracking-tight">
                        {stat.value}
                     </div>
                  </div>
               ))}
            </div>

            <Separator className="my-6" />
            <Heading title="Recent Orders" description="Latest 5 orders" />

            <div className="rounded-md border">
               <table className="w-full text-sm">
                  <thead>
                     <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left font-medium">Order #</th>
                        <th className="py-3 px-4 text-left font-medium">Customer</th>
                        <th className="py-3 px-4 text-left font-medium">Amount</th>
                        <th className="py-3 px-4 text-left font-medium">Status</th>
                     </tr>
                  </thead>
                  <tbody>
                     {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b last:border-0">
                           <td className="py-3 px-4">{order.orderNumber}</td>
                           <td className="py-3 px-4">{order.customerName}</td>
                           <td className="py-3 px-4">GH₵{order.totalAmount.toFixed(2)}</td>
                           <td className="py-3 px-4">
                              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                                 order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                 order.orderStatus === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                 order.orderStatus === 'OUT_FOR_DELIVERY' ? 'bg-blue-100 text-blue-800' :
                                 order.orderStatus === 'CONFIRMED' ? 'bg-purple-100 text-purple-800' :
                                 'bg-yellow-100 text-yellow-800'
                              }`}>
                                 {order.orderStatus.replace(/_/g, ' ')}
                              </span>
                           </td>
                        </tr>
                     ))}
                     {recentOrders.length === 0 && (
                        <tr><td colSpan={4} className="py-8 text-center text-muted-foreground">No orders yet</td></tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   )
}