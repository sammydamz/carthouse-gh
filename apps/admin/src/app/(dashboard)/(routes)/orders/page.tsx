'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { X } from 'lucide-react'

interface OrderItem {
  id: string; productId: string; productName: string; productImage: string | null
  quantity: number; price: number; size: string | null; color: string | null
}

interface Order {
  id: string; orderNumber: string; customerName: string; customerPhone: string
  customerRegion: string | null; customerAddress: string; deliveryInstructions: string | null
  paymentMethod: string; paymentStatus: string; orderStatus: string
  totalAmount: number; deliveryFee: number; createdAt: string; items: OrderItem[]
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  PENDING: 'outline', CONFIRMED: 'secondary', OUT_FOR_DELIVERY: 'default', DELIVERED: 'default', CANCELLED: 'destructive',
}

const paymentVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  PENDING: 'outline', PAID: 'default', DELIVERED_PAID: 'default',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders')
      setOrders(await res.json())
    } catch (e) { console.error('Error fetching orders:', e) }
    finally { setLoading(false) }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: status }),
      })
      if (res.ok) { fetchOrders(); if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, orderStatus: status }) }
    } catch (e) { console.error(e) }
    finally { setUpdating(false) }
  }

  const updatePaymentStatus = async (orderId: string, status: string) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: status }),
      })
      if (res.ok) { fetchOrders(); if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, paymentStatus: status }) }
    } catch (e) { console.error(e) }
    finally { setUpdating(false) }
  }

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading...</div>

  return (
    <div className="flex-col">
      <div className="flex-1 pt-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Orders</h1>
            <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6" style={{ gridTemplateColumns: selectedOrder ? '1fr 400px' : '1fr' }}>
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left font-medium">Order</th>
                    <th className="py-3 px-4 text-left font-medium">Customer</th>
                    <th className="py-3 px-4 text-left font-medium">Total</th>
                    <th className="py-3 px-4 text-left font-medium">Payment</th>
                    <th className="py-3 px-4 text-left font-medium">Status</th>
                    <th className="py-3 px-4 text-left font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} onClick={() => setSelectedOrder(order)}
                      className={`border-b last:border-0 cursor-pointer transition-colors hover:bg-muted/30 ${selectedOrder?.id === order.id ? 'bg-muted/50' : ''}`}>
                      <td className="py-3 px-4 font-medium text-primary">{order.orderNumber}</td>
                      <td className="py-3 px-4">
                        <div>{order.customerName}</div>
                        <div className="text-xs text-muted-foreground">{order.customerPhone}</div>
                      </td>
                      <td className="py-3 px-4 font-medium">GH₵{order.totalAmount.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <Badge variant={paymentVariant[order.paymentStatus] || 'outline'} className="text-xs">
                          {order.paymentStatus.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={statusVariant[order.orderStatus] || 'outline'} className="text-xs">
                          {order.orderStatus.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No orders yet</td></tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {selectedOrder && (
            <Card className="h-fit">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg">{selectedOrder.orderNumber}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}><X className="h-4 w-4" /></Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-2">Customer</h3>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customerPhone}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customerAddress}{selectedOrder.customerRegion ? `, ${selectedOrder.customerRegion}` : ''}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2">Items</h3>
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="text-sm">{item.productName || 'Product'}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}{item.size ? ` | ${item.size}` : ''}</p>
                      </div>
                      <p className="text-sm font-medium">GH₵{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold">Total</span>
                    <span className="text-base font-bold">GH₵{selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2">Update Status</h3>
                  <select value={selectedOrder.orderStatus} onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)} disabled={updating}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background mb-2">
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  <select value={selectedOrder.paymentStatus} onChange={(e) => updatePaymentStatus(selectedOrder.id, e.target.value)} disabled={updating}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="DELIVERED_PAID">Delivered & Paid</option>
                  </select>
                </div>

                {selectedOrder.deliveryInstructions && (
                  <div>
                    <h3 className="text-sm font-semibold mb-1">Notes</h3>
                    <p className="text-sm text-muted-foreground">{selectedOrder.deliveryInstructions}</p>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Payment: {selectedOrder.paymentMethod === 'PAYSTACK' ? 'Online (Paystack)' : 'Cash on Delivery'}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}