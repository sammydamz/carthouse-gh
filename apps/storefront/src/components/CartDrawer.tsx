'use client'

import { useCart } from '@/lib/cart'
import Link from 'next/link'
import { colors, rounded } from '@/lib/design-system'

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, total, clearCart } = useCart()

  if (!isOpen) return null

  return (
    <>
      <div
        onClick={() => setIsOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 200,
        }}
      />
<div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 420,
          maxWidth: '100vw',
          background: colors.canvas,
          zIndex: 201,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 24px rgba(0,0,0,0.12)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: `1px solid ${colors.hairlineSoft}`,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, color: colors.ink }}>
            Shopping Cart ({items.length})
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              width: 44,
              height: 44,
              borderRadius: rounded.pill,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width={20} height={20} fill="none" stroke={colors.muted} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <svg width={64} height={64} fill={colors.hairline} viewBox="0 0 24 24" style={{ margin: '0 auto 16px' }}>
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p style={{ color: colors.muted, fontSize: 16 }}>Your cart is empty</p>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  marginTop: 16,
                  padding: '10px 20px',
                  background: colors.primary,
                  color: colors.onPrimary,
                  border: 'none',
                  borderRadius: rounded.pill,
                  height: 44,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: 12,
                    padding: 12,
                    background: colors.surfaceSoft,
                    borderRadius: rounded.xl,
                  }}
                >
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 8,
                      background: colors.canvas,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <svg width={24} height={24} fill={colors.hairline} viewBox="0 0 24 24">
                        <path d="M4 4h16v16H4V4z" />
                      </svg>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: colors.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </div>
                    {item.variant && (
                      <div style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>{item.variant}</div>
                    )}
                    <div style={{ fontSize: 14, fontWeight: 700, color: colors.ink, marginTop: 4 }}>
                      GH₵{item.price.toFixed(2)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ width: 28, height: 28, borderRadius: rounded.pill, border: `1px solid ${colors.hairline}`, background: colors.canvas, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: 14, fontWeight: 600, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        style={{ width: 28, height: 28, borderRadius: rounded.pill, border: `1px solid ${colors.hairline}`, background: colors.canvas, cursor: item.quantity >= item.maxStock ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: item.quantity >= item.maxStock ? 0.5 : 1 }}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{ marginLeft: 'auto', border: 'none', background: 'transparent', cursor: 'pointer', color: colors.muted, fontSize: 13 }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div style={{ padding: 20, borderTop: `1px solid ${colors.hairlineSoft}`, background: colors.surfaceSoft }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 14, color: colors.muted }}>Subtotal</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: colors.ink }}>GH₵{total.toFixed(2)}</span>
            </div>
            <Link
              href="/store/checkout"
              onClick={() => setIsOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: 48,
                borderRadius: rounded.pill,
                border: 'none',
                background: colors.primary,
                color: colors.onPrimary,
                fontSize: 16,
                fontWeight: 600,
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={clearCart}
              style={{
                width: '100%',
                marginTop: 8,
                height: 40,
                borderRadius: 8,
                border: 'none',
                background: 'transparent',
                color: colors.muted,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}