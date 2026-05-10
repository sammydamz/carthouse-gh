'use client'

import { useState, useEffect } from 'react'

interface Category {
  id: string
  name: string
  slug: string
  imageUrl: string | null
  children: Category[]
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  media: string[]
  isAvailable: boolean
  category: Category | null
}

interface HeroSlide {
  id: number
  title: string
  subtitle: string
  image: string
  cta: string
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: 'Get 25% Off',
    subtitle: 'Top-rated electronics and accessories',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=600&fit=crop',
    cta: 'Shop Now',
  },
  {
    id: 2,
    title: 'Premium Tech',
    subtitle: 'Latest gadgets at great prices',
    image: 'https://images.unsplash.com/photo-1519385970471-6ba2754f8f34?w=1200&h=600&fit=crop',
    cta: 'Explore',
  },
  {
    id: 3,
    title: 'Free Delivery',
    subtitle: 'On orders over GH₵500',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=600&fit=crop',
    cta: 'Learn More',
  },
]

const socialLinks = [
  { name: 'Facebook', icon: 'f', url: '#' },
  { name: 'Instagram', icon: 'ig', url: '#' },
  { name: 'Twitter', icon: 'x', url: '#' },
  { name: 'WhatsApp', icon: 'wa', url: '#' },
]

export default function StorefrontPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    fetch('/api/public/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.filter((c: Category) => !c.parentId)))
      .catch(console.error)

    fetch('/api/public/products?limit=12')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(console.error)

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1)
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#ffffff', color: '#1c1e21' }}>
      {/* Navbar */}
      <header style={{ position: 'sticky', top: 0, background: '#ffffff', borderBottom: '1px solid #dee3e9', zIndex: 100 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ fontSize: 24, fontWeight: 700, color: '#0064e0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 32, height: 32, background: '#0064e0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18 }}>C</span>
            CartHouse GH
          </div>

          {/* Search */}
          <div style={{ flex: 1, maxWidth: 400, margin: '0 24px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', height: 40, padding: '0 16px 0 40px', borderRadius: 100, border: '1px solid #ced0d4', background: '#f1f4f7', fontSize: 14, outline: 'none' }}
              />
              <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: '#5d6c7b' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Nav Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a href="#" style={{ color: '#1c1e21', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Home</a>
            <a href="#" style={{ color: '#5d6c7b', textDecoration: 'none', fontSize: 14 }}>Deals</a>
            <a href="#" style={{ color: '#5d6c7b', textDecoration: 'none', fontSize: 14 }}>Contact</a>
            <button style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: '#f1f4f7', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <svg width={20} height={20} fill="none" stroke="#1c1e21" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: -2, right: -2, background: '#0064e0', color: '#fff', fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cartCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Carousel */}
      <section style={{ position: 'relative', height: 400, overflow: 'hidden', background: '#0a1317' }}>
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            style={{
              position: 'absolute', inset: 0,
              opacity: index === currentSlide ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}
          >
            <img src={slide.image} alt={slide.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <h1 style={{ fontSize: 48, fontWeight: 500, marginBottom: 12 }}>{slide.title}</h1>
              <p style={{ fontSize: 18, marginBottom: 24, color: '#ced0d4' }}>{slide.subtitle}</p>
              <button style={{ padding: '14px 30px', borderRadius: 100, border: 'none', background: '#000000', color: '#ffffff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                {slide.cta}
              </button>
            </div>
          </div>
        ))}
        {/* Dots */}
        <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{ width: 10, height: 10, borderRadius: '50%', border: 'none', background: index === currentSlide ? '#ffffff' : 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
            />
          ))}
        </div>
        {/* Arrows */}
        <button onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', fontSize: 20 }}>‹</button>
        <button onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)} style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', fontSize: 20 }}>›</button>
      </section>

      {/* Category Grid */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 500, marginBottom: 24 }}>Shop by Category</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          {categories.slice(0, 8).map((cat) => (
            <a
              key={cat.id}
              href={`/category/${cat.slug}`}
              style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ borderRadius: 32, overflow: 'hidden', border: '1px solid #dee3e9', transition: 'box-shadow 0.2s' }}>
                {cat.imageUrl ? (
                  <img src={cat.imageUrl} alt={cat.name} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: 140, background: '#f1f4f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width={40} height={40} fill="#5d6c7b" viewBox="0 0 24 24">
                      <path d="M4 4h16v16H4V4zm2 2v12h12V6H6z" />
                    </svg>
                  </div>
                )}
                <div style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{cat.name}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 64px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 500, marginBottom: 24 }}>Featured Products</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {products.filter(p => p.isAvailable).slice(0, 12).map((product) => (
            <div
              key={product.id}
              style={{ borderRadius: 32, border: '1px solid #dee3e9', overflow: 'hidden', transition: 'box-shadow 0.2s', cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div style={{ aspectRatio: '1/1', background: '#f1f4f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {product.media[0] ? (
                  <img src={product.media[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 16 }} />
                ) : (
                  <svg width={60} height={60} fill="#5d6c7b" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-2h2v-4h4v-2h-4V7h-2v4H8v2h4z" />
                  </svg>
                )}
              </div>
              <div style={{ padding: '12px 16px' }}>
                {product.category && (
                  <span style={{ fontSize: 11, color: '#5d6c7b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{product.category.name}</span>
                )}
                <h3 style={{ fontSize: 14, fontWeight: 600, margin: '4px 0', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{product.name}</h3>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1c1e21', marginTop: 8 }}>GH₵{product.price.toFixed(2)}</div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleAddToCart() }}
                  style={{ width: '100%', marginTop: 12, padding: '10px 16px', borderRadius: 100, border: 'none', background: '#0064e0', color: '#ffffff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#ffffff', borderTop: '1px solid #dee3e9', padding: '64px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0064e0', marginBottom: 16 }}>CartHouse GH</div>
            <p style={{ fontSize: 14, color: '#5d6c7b', lineHeight: 1.6 }}>Your trusted destination for premium electronics and gadgets in Ghana.</p>
          </div>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Contact</h4>
            <p style={{ fontSize: 14, color: '#5d6c7b', marginBottom: 8 }}>📞 +233 20 123 4567</p>
            <p style={{ fontSize: 14, color: '#5d6c7b', marginBottom: 8 }}>📧 info@carthousegh.com</p>
            <p style={{ fontSize: 14, color: '#5d6c7b' }}>📍 Accra, Ghana</p>
          </div>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="#" style={{ fontSize: 14, color: '#5d6c7b', textDecoration: 'none' }}>About Us</a>
              <a href="#" style={{ fontSize: 14, color: '#5d6c7b', textDecoration: 'none' }}>Shop</a>
              <a href="#" style={{ fontSize: 14, color: '#5d6c7b', textDecoration: 'none' }}>Deals</a>
              <a href="#" style={{ fontSize: 14, color: '#5d6c7b', textDecoration: 'none' }}>Contact</a>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Follow Us</h4>
            <div style={{ display: 'flex', gap: 12 }}>
              {socialLinks.map((link) => (
                <a key={link.name} href={link.url} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #dee3e9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5d6c7b', textDecoration: 'none', fontSize: 12 }}>
                  {link.icon === 'f' && 'f'}
                  {link.icon === 'ig' && 'IG'}
                  {link.icon === 'x' && 'X'}
                  {link.icon === 'wa' && 'WA'}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1280, margin: '32px auto 0', paddingTop: 24, borderTop: '1px solid #dee3e9', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#8595a4' }}>© 2026 CartHouse GH. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}