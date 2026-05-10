'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart, CartItem } from '@/lib/cart'
import { colors, rounded, inputStyle } from '@/lib/design-system'

interface CustomerInfo {
  name: string
  email: string
  phone: string
}

interface ShippingAddress {
  address: string
  city: string
  region: string
  notes: string
}

function Navbar() {
  const { itemCount, setIsOpen } = useCart()
  
  return (
    <header style={{ position: 'sticky', top: 0, background: colors.canvas, borderBottom: `1px solid ${colors.hairlineSoft}`, zIndex: 100, height: 60 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="/store" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, background: colors.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.onPrimary, fontWeight: 700, fontSize: 16 }}>C</div>
            <span style={{ fontSize: 16, fontWeight: 600, color: colors.ink }}>CartHouse GH</span>
          </a>
        </div>
        <button onClick={() => setIsOpen(true)} style={{ width: 44, height: 44, borderRadius: rounded.pill, border: 'none', background: colors.surfaceSoft, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <svg width={20} height={20} fill="none" stroke={colors.ink} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {itemCount > 0 && (
            <span style={{ position: 'absolute', top: -2, right: -2, background: colors.primary, color: colors.onPrimary, fontSize: 10, fontWeight: 700, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{itemCount}</span>
          )}
        </button>
      </div>
    </header>
  )
}

function FormField({ label, name, value, onChange, type = 'text', placeholder, required = true, textarea = false }: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  type?: string
  placeholder?: string
  required?: boolean
  textarea?: boolean
}) {
  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: 44,
    padding: '0 14px',
    borderRadius: 100,
    border: `1px solid ${colors.hairline}`,
    fontSize: 14,
    outline: 'none',
    background: colors.canvas,
    color: colors.ink,
    boxSizing: 'border-box',
  }
  
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: colors.ink, marginBottom: 6 }}>
        {label} {required && <span style={{ color: colors.semanticDown }}>*</span>}
      </label>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={3}
          style={{ ...inputStyle, resize: 'vertical', padding: '12px 14px', height: 'auto' }}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          style={inputStyle}
        />
      )}
    </div>
  )
}

function CartSummary({ items, total }: { items: CartItem[]; total: number }) {
  return (
    <div style={{ background: colors.surfaceSoft, borderRadius: rounded.xl, padding: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.ink, marginBottom: 16 }}>Order Summary</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16, maxHeight: 300, overflow: 'auto' }}>
        {items.map((item) => (
          <div key={item.id} style={{ display: 'flex', gap: 12, padding: 12, background: colors.canvas, borderRadius: rounded.lg }}>
            <div style={{ width: 56, height: 56, borderRadius: rounded.md, background: colors.surfaceSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              {item.image ? (
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <svg width={20} height={20} fill={colors.hairline} viewBox="0 0 24 24"><path d="M4 4h16v16H4V4z" /></svg>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: colors.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
              {item.variant && <div style={{ fontSize: 11, color: colors.muted }}>{item.variant}</div>}
              <div style={{ fontSize: 12, color: colors.muted }}>Qty: {item.quantity}</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: colors.ink }}>GH₵{(item.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>
      
      <div style={{ borderTop: `1px solid ${colors.hairline}`, paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 14, color: colors.muted }}>Total</span>
        <span style={{ fontSize: 24, fontWeight: 700, color: colors.ink }}>GH₵{total.toFixed(2)}</span>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
  })
  
  const [shipping, setShipping] = useState<ShippingAddress>({
    address: '',
    city: '',
    region: '',
    notes: '',
  })
  
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'bank_transfer' | 'cod'>('mobile_money')
  
  useEffect(() => {
    if (items.length === 0) {
      router.push('/store')
    }
  }, [items.length, router])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        variant: item.variant || null,
      }))
      
      const response = await fetch('/api/public/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          shippingAddress: shipping.address,
          shippingCity: shipping.city,
          shippingRegion: shipping.region,
          shippingNotes: shipping.notes,
          paymentMethod,
          items: orderItems,
          totalAmount: total,
        }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create order')
      }
      
      const order = await response.json()
      clearCart()
      router.push(`/store/order-confirmation?order=${order.orderNumber}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }
  
  if (items.length === 0) {
    return null
  }
  
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: colors.canvas, color: colors.ink, minHeight: '100vh' }}>
      <Navbar />
      
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: colors.ink, marginBottom: 32 }}>Checkout</h1>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 32 }}>
            <div>
              {error && (
                <div style={{ padding: 16, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: rounded.lg, color: colors.semanticDown, marginBottom: 24 }}>
                  {error}
                </div>
              )}
              
              <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: colors.ink, marginBottom: 16 }}>Contact Information</h2>
                <div style={{ display: 'grid', gap: 16 }}>
                  <FormField
                    label="Full Name"
                    name="name"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                  <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                  <FormField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="+233 XX XXX XXXX"
                  />
                </div>
              </section>
              
              <section style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: colors.ink, marginBottom: 16 }}>Shipping Address</h2>
                <div style={{ display: 'grid', gap: 16 }}>
                  <FormField
                    label="Address"
                    name="address"
                    value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                    placeholder="Street address"
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <FormField
                      label="City"
                      name="city"
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      placeholder="Accra"
                    />
                    <FormField
                      label="Region"
                      name="region"
                      value={shipping.region}
                      onChange={(e) => setShipping({ ...shipping, region: e.target.value })}
                      placeholder="Greater Accra"
                    />
                  </div>
                  <FormField
                    label="Notes"
                    name="notes"
                    value={shipping.notes}
                    onChange={(e) => setShipping({ ...shipping, notes: e.target.value })}
                    placeholder="Delivery instructions (optional)"
                    required={false}
                    textarea
                  />
                </div>
              </section>
              
              <section>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: colors.ink, marginBottom: 16 }}>Payment Method</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { value: 'mobile_money', label: 'Mobile Money (MTN/Vodafone/AirtelTigo)', desc: 'Pay via mobile money wallet' },
                    { value: 'bank_transfer', label: 'Bank Transfer', desc: 'Transfer to our bank account' },
                    { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive your order' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: 16,
                        borderRadius: rounded.lg,
                        border: `1px solid ${paymentMethod === option.value ? colors.primary : colors.hairline}`,
                        background: paymentMethod === option.value ? '#f0f7ff' : colors.canvas,
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={option.value}
                        checked={paymentMethod === option.value as typeof paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
                        style={{ width: 18, height: 18, accentColor: colors.primary }}
                      />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: colors.ink }}>{option.label}</div>
                        <div style={{ fontSize: 12, color: colors.muted }}>{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </section>
            </div>
            
            <div>
              <CartSummary items={items} total={total} />
              
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  marginTop: 16,
                  height: 52,
                  borderRadius: rounded.pill,
                  border: 'none',
                  background: loading ? colors.hairline : colors.primary,
                  color: colors.onPrimary,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Processing...' : `Place Order - GH₵${total.toFixed(2)}`}
              </button>
            </div>
          </div>
        </form>
      </main>
      
      <footer style={{ background: colors.canvas, borderTop: `1px solid ${colors.hairlineSoft}`, padding: '48px 24px', marginTop: 64 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: colors.mutedSoft }}>© 2026 CartHouse GH. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}