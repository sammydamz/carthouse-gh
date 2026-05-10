import Navbar from '@/components/navbar'

export default async function DashboardLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      <>
         <Navbar />
         <div className="px-6 md:px-12 lg:px-16 xl:px-24">
            {children}
         </div>
      </>
   )
}
