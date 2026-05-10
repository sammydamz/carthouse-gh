import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAdmin } from '@/lib/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await getAdmin()

  if (!admin) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-64 bg-gray-900 text-white min-h-screen">
          <div className="p-4 border-b border-gray-800">
            <h1 className="text-xl font-bold">CartHouse GH</h1>
            <p className="text-sm text-gray-400">Admin Dashboard</p>
          </div>
          <nav className="mt-4">
            <Link
              href="/admin"
              className="block px-4 py-2 hover:bg-gray-800"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="block px-4 py-2 hover:bg-gray-800"
            >
              Products
            </Link>
            <Link
              href="/admin/categories"
              className="block px-4 py-2 hover:bg-gray-800"
            >
              Categories
            </Link>
            <Link
              href="/admin/suppliers"
              className="block px-4 py-2 hover:bg-gray-800"
            >
              Suppliers
            </Link>
            <Link
              href="/admin/orders"
              className="block px-4 py-2 hover:bg-gray-800"
            >
              Orders
            </Link>
            <Link
              href="/admin/banners"
              className="block px-4 py-2 hover:bg-gray-800"
            >
              Banners
            </Link>
            <Link
              href="/admin/settings"
              className="block px-4 py-2 hover:bg-gray-800"
            >
              Settings
            </Link>
          </nav>
          <div className="absolute bottom-0 w-64 p-4 border-t border-gray-800">
            <form action="/api/admin/auth/logout" method="POST">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
              >
                Logout
              </button>
            </form>
          </div>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}