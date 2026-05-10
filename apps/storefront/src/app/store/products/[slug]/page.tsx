'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useCart } from '@/lib/cart'

const colors = {
  canvas: '#ffffff',
  surfaceSoft: '#f1f4f7',
  inkDeep: '#0a1317',
  ink: '#1c1e21',
  charcoal: '#444950',
  slate: '#4b4c4f',
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

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  stock: number
  media: string[]
  isAvailable: boolean
  category: Record<string, unknown> | null
  supplier: { id: string; name: string } | null
  variants: { id: string; variantId: string; size: string | null; color: string | null; stock: number }[]
  createdAt?: string
  updatedAt?: string
}

function Breadcrumb({ category }: { category: Record<string, unknown> | null }) {
  return (
    <div style={{ fontSize: 13, color: colors.steel, marginBottom: 24 }}>
      <a href="/store" style={{ color: colors.charcoal, textDecoration: 'none' }}>Home</a>
      <span style={{ margin: '0 8px' }}>/</span>
      <a href="/store" style={{ color: colors.charcoal, textDecoration: 'none' }}>Products</a>
      {category && (
        <>
          <span style={{ margin: '0 8px' }}>/</span>
          <a href={`/store?categories=${(category as Record<string, unknown>).id}`} style={{ color: colors.charcoal, textDecoration: 'none' }}>{(category as Record<string, unknown>).name as string}</a>
        </>
      )}
    </div>
  )
}

function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [selected, setSelected] = useState(0)
  
  if (images.length === 0) {
    return (
      <div style={{ width: '100%', aspectRatio: '1/1', background: colors.surfaceSoft, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={64} height={64} fill={colors.steel} viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6z" /></svg>
      </div>
    )
  }
  
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {images.slice(0, 5).map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            style={{
              width: 64,
              height: 64,
              borderRadius: 8,
              border: selected === i ? `2px solid ${colors.primary}` : `1px solid ${colors.hairlineSoft}`,
              overflow: 'hidden',
              padding: 0,
              cursor: 'pointer',
              background: colors.surfaceSoft,
            }}
          >
            <img src={img} alt={`${name} ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </button>
        ))}
      </div>
      <div style={{ flex: 1, borderRadius: 12, overflow: 'hidden', background: colors.surfaceSoft }}>
        <img src={images[selected]} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 24 }} />
      </div>
    </div>
  )
}

function ProductInfo({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]?.id || '')
  
  const variant = product.variants.find(v => v.id === selectedVariant)
  const currentPrice = product.price
  const currentStock = variant ? variant.stock : product.stock
  
  return (
    <div style={{ flex: 1 }}>
      {product.category && (
        <span style={{ fontSize: 12, color: colors.primary, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{(product.category as Record<string, unknown>).name as string}</span>
      )}
      
      <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.inkDeep, margin: '8px 0 16px', lineHeight: 1.3 }}>{product.name}</h1>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: colors.inkDeep }}>GH₵{currentPrice.toFixed(2)}</span>
        {currentStock > 0 ? (
          <span style={{ padding: '4px 12px', borderRadius: 20, background: colors.success, color: colors.canvas, fontSize: 12, fontWeight: 600 }}>In Stock</span>
        ) : (
          <span style={{ padding: '4px 12px', borderRadius: 20, background: colors.critical, color: colors.canvas, fontSize: 12, fontWeight: 600 }}>Out of Stock</span>
        )}
      </div>
      
      {product.variants.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 14, fontWeight: 600, color: colors.ink, display: 'block', marginBottom: 8 }}>Variant</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant.id)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: selectedVariant === variant.id ? 'none' : `1px solid ${colors.hairline}`,
                  background: selectedVariant === variant.id ? colors.inkDeep : colors.canvas,
                  color: selectedVariant === variant.id ? colors.canvas : colors.charcoal,
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                {variant.size || variant.color || variant.variantId}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${colors.hairline}`, borderRadius: 8 }}>
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            style={{ width: 40, height: 40, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18, color: colors.charcoal }}
          >
            -
          </button>
          <span style={{ width: 40, textAlign: 'center', fontSize: 16, fontWeight: 600 }}>{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
            style={{ width: 40, height: 40, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18, color: colors.charcoal }}
          >
            +
          </button>
        </div>
        
        <button
          onClick={() => addItem({
            productId: product.id,
            name: product.name,
            price: currentPrice,
            quantity,
            image: product.media[0] || null,
            variant: variant ? `${variant.size || ''} ${variant.color || ''}`.trim() : undefined,
            maxStock: currentStock,
          })}
          disabled={currentStock === 0}
          style={{
            flex: 1,
            height: 48,
            borderRadius: 8,
            border: 'none',
            background: currentStock === 0 ? colors.hairline : colors.primary,
            color: colors.onPrimary,
            fontSize: 16,
            fontWeight: 600,
            cursor: currentStock === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          Add to Cart
        </button>
        
        <button
          style={{ width: 48, height: 48, borderRadius: 8, border: `1px solid ${colors.hairline}`, background: colors.canvas, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width={20} height={20} fill="none" stroke={colors.charcoal} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </button>
      </div>
      
      <div style={{ borderTop: `1px solid ${colors.hairlineSoft}`, paddingTop: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.ink, marginBottom: 12 }}>Description</h3>
        <p style={{ fontSize: 14, color: colors.charcoal, lineHeight: 1.6 }}>{product.description || 'No description available.'}</p>
      </div>
      
      {product.supplier && (
        <div style={{ marginTop: 24, padding: 16, background: colors.surfaceSoft, borderRadius: 8 }}>
          <span style={{ fontSize: 12, color: colors.steel }}>Sold by</span>
          <div style={{ fontSize: 14, fontWeight: 600, color: colors.ink, marginTop: 4 }}>{product.supplier.name}</div>
        </div>
      )}
    </div>
  )
}

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cartCount, setCartCount] = useState(0)
  
  useEffect(() => {
    fetch(`/api/public/products/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found')
        return res.json()
      })
      .then((data) => {
        setProduct(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [slug])
  
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: colors.steel }}>Loading...</div>
      </div>
    )
  }
  
  if (error || !product) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 48 }}>😕</div>
        <div style={{ fontSize: 18, color: colors.charcoal }}>{error || 'Product not found'}</div>
        <a href="/store" style={{ color: colors.primary, textDecoration: 'none' }}>← Back to store</a>
      </div>
    )
  }
  
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: colors.canvas, color: colors.ink, minHeight: '100vh' }}>
      {/* Navbar */}
      <header style={{ position: 'sticky', top: 0, background: colors.canvas, borderBottom: `1px solid ${colors.hairlineSoft}`, zIndex: 100, height: 60 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href="/store" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
              <div style={{ width: 28, height: 28, background: colors.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.onPrimary, fontWeight: 700, fontSize: 16 }}>C</div>
              <span style={{ fontSize: 16, fontWeight: 600, color: colors.ink }}>CartHouse GH</span>
            </a>
          </div>
          <button style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: colors.surfaceSoft, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <svg width={20} height={20} fill="none" stroke={colors.ink} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: -2, right: -2, background: colors.primary, color: colors.onPrimary, fontSize: 10, fontWeight: 700, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>
            )}
          </button>
        </div>
      </header>
      
      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
        <Breadcrumb category={product.category} />
        
        <div style={{ display: 'flex', gap: 48 }}>
          <div style={{ flex: 1, maxWidth: 500 }}>
            <ImageGallery images={product.media} name={product.name} />
          </div>
          <ProductInfo product={product} />
        </div>
      </main>
      
      {/* Footer */}
      <footer style={{ background: colors.canvas, borderTop: `1px solid ${colors.hairlineSoft}`, padding: '64px 24px', marginTop: 64 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: colors.primary, marginBottom: 16 }}>CartHouse GH</div>
            <p style={{ fontSize: 14, color: colors.steel, lineHeight: 1.6 }}>Your trusted destination for premium electronics and gadgets in Ghana.</p>
          </div>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: colors.ink }}>Contact</h4>
            <p style={{ fontSize: 14, color: colors.steel, marginBottom: 8 }}>+233 20 123 4567</p>
            <p style={{ fontSize: 14, color: colors.steel, marginBottom: 8 }}>info@carthousegh.com</p>
            <p style={{ fontSize: 14, color: colors.steel }}>Accra, Ghana</p>
          </div>
        </div>
        <div style={{ maxWidth: 1400, margin: '32px auto 0', paddingTop: 24, borderTop: `1px solid ${colors.hairlineSoft}`, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: colors.stone }}>© 2026 CartHouse GH. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}