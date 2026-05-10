'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCart } from '@/lib/cart'
import Link from 'next/link'
import { colors, rounded } from '@/lib/design-system'

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
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: colors.semanticUp, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width={40} height={40} fill="none" stroke={colors.canvas} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 700, color: colors.ink, marginBottom: 12 }}>
            Order Placed Successfully!
          </h1>
          
          <p style={{ fontSize: 16, color: colors.muted, marginBottom: 24, lineHeight: 1.5 }}>
            Thank you for your order. We've received your order and will process it shortly.
          </p>

          {orderNumber && (
            <div style={{ background: colors.surfaceSoft, borderRadius: rounded.xl, padding: 20, marginBottom: 32 }}>
              <p style={{ fontSize: 13, color: colors.muted, marginBottom: 4 }}>Order Number</p>
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
                borderRadius: rounded.pill,
                height: 52,
                lineHeight: '52px',
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
                color: colors.muted,
                border: `1px solid ${colors.hairline}`,
                borderRadius: rounded.pill,
                height: 52,
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
          <p style={{ fontSize: 14, color: colors.muted, marginBottom: 8 }}>
            Need help? Contact us at
          </p>
          <p style={{ fontSize: 14, color: colors.primary, fontWeight: 500 }}>
            +233 20 123 4567
          </p>
          <p style={{ fontSize: 12, color: colors.mutedSoft, marginTop: 16 }}>
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