'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCart } from '@/lib/cart'
import Link from 'next/link'

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

function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order')
  const { setIsOpen } = useCart()

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: colors.canvas, color: colors.ink, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <header style={{ background: colors.canvas, borderBottom: `1px solid ${colors.hairlineSoft}`, zIndex: 100, height: 60 }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', alignItems: 'center' }}>
          <Link href="/store" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, background: colors.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.onPrimary, fontWeight: 700, fontSize: 16 }}>C</div>
            <span style={{ fontSize: 16, fontWeight: 600, color: colors.ink }}>CartHouse GH</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          {/* Success Icon */}
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: colors.success, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width={40} height={40} fill="none" stroke={colors.canvas} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 700, color: colors.inkDeep, marginBottom: 12 }}>
            Order Placed Successfully!
          </h1>
          
          <p style={{ fontSize: 16, color: colors.charcoal, marginBottom: 24, lineHeight: 1.5 }}>
            Thank you for your order. We've received your order and will process it shortly.
          </p>

          {orderNumber && (
            <div style={{ background: colors.surfaceSoft, borderRadius: 12, padding: 20, marginBottom: 32 }}>
              <p style={{ fontSize: 13, color: colors.steel, marginBottom: 4 }}>Order Number</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: colors.primary }}>{orderNumber}</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link
              href="/store"
              style={{
                display: 'block',
                padding: '14px 24px',
                background: colors.primary,
                color: colors.onPrimary,
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              Continue Shopping
            </Link>
            <button
              onClick={() => setIsOpen(true)}
              style={{
                padding: '14px 24px',
                background: colors.canvas,
                color: colors.charcoal,
                border: `1px solid ${colors.hairline}`,
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 500,
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              View Order Details
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: colors.canvas, borderTop: `1px solid ${colors.hairlineSoft}`, padding: '32px 24px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: colors.steel, marginBottom: 8 }}>
            Need help? Contact us at
          </p>
          <p style={{ fontSize: 14, color: colors.primary, fontWeight: 500 }}>
            +233 20 123 4567
          </p>
          <p style={{ fontSize: 12, color: colors.stone, marginTop: 16 }}>
            © 2026 CartHouse GH. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

function OrderConfirmationWithSuspense() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <OrderConfirmationPage />
    </Suspense>
  )
}

export default OrderConfirmationWithSuspense