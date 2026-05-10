'use client'

import { useState, useEffect } from 'react'

const colors = {
  canvas: '#ffffff',
  surfaceSoft: '#f1f4f7',
  inkDeep: '#0a1317',
  ink: '#1c1e21',
  charcoal: '#444950',
  steel: '#5d6c7b',
  stone: '#8595a4',
  hairline: '#ced0d4',
  hairlineSoft: '#dee3e9',
  primary: '#0064e0',
  onPrimary: '#ffffff',
  success: '#31a24c',
  warning: '#f2a918',
  critical: '#e41e3f',
}

interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string | null
  quantity: number
  price: number
  size: string | null
  color: string | null
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerRegion: string | null
  customerAddress: string
  deliveryInstructions: string | null
  paymentMethod: string
  paymentStatus: string
  orderStatus: string
  totalAmount: number
  deliveryFee: number
  createdAt: string
  items: OrderItem[]
}

const statusColors: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: '#fef3c7', text: '#92400e' },
  CONFIRMED: { bg: '#dbeafe', text: '#1e40af' },
  OUT_FOR_DELIVERY: { bg: '#e0e7ff', text: '#3730a3' },
  DELIVERED: { bg: '#d1fae5', text: '#065f46' },
  CANCELLED: { bg: '#fee2e2', text: '#991b1b' },
}

const paymentStatusColors: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: '#fef3c7', text: '#92400e' },
  PAID: { bg: '#d1fae5', text: '#065f46' },
  DELIVERED_PAID: { bg: '#d1fae5', text: '#065f46' },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders')
      const data = await res.json()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: status }),
      })
      if (res.ok) {
        fetchOrders()
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: status })
        }
      }
    } catch (error) {
      console.error('Error updating order:', error)
    } finally {
      setUpdating(false)
    }
  }

  const updatePaymentStatus = async (orderId: string, status: string) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: status }),
      })
      if (res.ok) {
        fetchOrders()
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, paymentStatus: status })
        }
      }
    } catch (error) {
      console.error('Error updating payment:', error)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: colors.steel }}>Loading...</div>
    )
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.inkDeep }}>Orders</h1>
        <span style={{ fontSize: 14, color: colors.steel }}>{orders.length} orders</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedOrder ? '1fr 400px' : '1fr', gap: 24 }}>
        <div>
          <div style={{ background: colors.canvas, borderRadius: 12, border: `1px solid ${colors.hairlineSoft}`, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: colors.surfaceSoft, borderBottom: `1px solid ${colors.hairlineSoft}` }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.charcoal }}>Order</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.charcoal }}>Customer</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.charcoal }}>Total</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.charcoal }}>Payment</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.charcoal }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.charcoal }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    style={{ cursor: 'pointer', borderBottom: `1px solid ${colors.hairlineSoft}`, background: selectedOrder?.id === order.id ? colors.surfaceSoft : colors.canvas }}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: colors.primary }}>{order.orderNumber}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontSize: 14, color: colors.ink }}>{order.customerName}</div>
                      <div style={{ fontSize: 12, color: colors.steel }}>{order.customerPhone}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: colors.ink }}>GH₵{order.totalAmount.toFixed(2)}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        background: paymentStatusColors[order.paymentStatus]?.bg || colors.surfaceSoft,
                        color: paymentStatusColors[order.paymentStatus]?.text || colors.charcoal,
                      }}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        background: statusColors[order.orderStatus]?.bg || colors.surfaceSoft,
                        color: statusColors[order.orderStatus]?.text || colors.charcoal,
                      }}>
                        {order.orderStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 12, color: colors.steel }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedOrder && (
          <div style={{ background: colors.canvas, borderRadius: 12, border: `1px solid ${colors.hairlineSoft}`, padding: 24, height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: colors.inkDeep }}>{selectedOrder.orderNumber}</h2>
              <button onClick={() => setSelectedOrder(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: colors.steel }}>
                <svg width={20} height={20} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.ink, marginBottom: 8 }}>Customer</h3>
              <p style={{ fontSize: 14, color: colors.charcoal }}>{selectedOrder.customerName}</p>
              <p style={{ fontSize: 13, color: colors.steel }}>{selectedOrder.customerPhone}</p>
              <p style={{ fontSize: 13, color: colors.steel }}>{selectedOrder.customerAddress}, {selectedOrder.customerRegion}</p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.ink, marginBottom: 8 }}>Items</h3>
              {selectedOrder.items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${colors.hairlineSoft}` }}>
                  <div>
                    <div style={{ fontSize: 13, color: colors.ink }}>{item.productName || 'Product'}</div>
                    <div style={{ fontSize: 12, color: colors.steel }}>Qty: {item.quantity} {item.size && `| ${item.size}`}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: colors.ink }}>GH₵{(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: colors.ink }}>Total</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: colors.inkDeep }}>GH₵{selectedOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.ink, marginBottom: 8 }}>Update Status</h3>
              <select
                value={selectedOrder.orderStatus}
                onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                disabled={updating}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${colors.hairline}`, fontSize: 14, background: colors.canvas, marginBottom: 8 }}
              >
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <select
                value={selectedOrder.paymentStatus}
                onChange={(e) => updatePaymentStatus(selectedOrder.id, e.target.value)}
                disabled={updating}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${colors.hairline}`, fontSize: 14, background: colors.canvas }}
              >
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="DELIVERED_PAID">Delivered & Paid</option>
              </select>
            </div>

            {selectedOrder.deliveryInstructions && (
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.ink, marginBottom: 8 }}>Notes</h3>
                <p style={{ fontSize: 13, color: colors.charcoal }}>{selectedOrder.deliveryInstructions}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}