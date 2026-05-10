import { getAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
  const admin = await getAdmin()

  const [orderCount, productCount, categoryCount, supplierCount] =
    await Promise.all([
      prisma.order.count(),
      prisma.product.count({ where: { isDeleted: false } }),
      prisma.category.count(),
      prisma.supplier.count(),
    ])

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome, {admin?.name}</p>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-500 text-sm">Total Orders</div>
          <div className="text-3xl font-bold">{orderCount}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-500 text-sm">Products</div>
          <div className="text-3xl font-bold">{productCount}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-500 text-sm">Categories</div>
          <div className="text-3xl font-bold">{categoryCount}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-500 text-sm">Suppliers</div>
          <div className="text-3xl font-bold">{supplierCount}</div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Order #</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="px-4 py-2">{order.orderNumber}</td>
                <td className="px-4 py-2">{order.customerName}</td>
                <td className="px-4 py-2">GH₵{order.totalAmount.toFixed(2)}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      order.orderStatus === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.orderStatus === 'DELIVERED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}