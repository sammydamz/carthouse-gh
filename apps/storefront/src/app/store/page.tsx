'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/lib/cart'
import { colors, rounded } from '@/lib/design-system'
import { PhoneIcon, MailIcon, LocationIcon, FacebookIcon, InstagramIcon, TwitterIcon, WhatsAppIcon } from '@/components/FooterIcons'

interface Category {
  id: string
  name: string
  children?: Category[]
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  media: string[]
  isAvailable: boolean
  category: Category | null
  supplier: { name: string } | null
}

type FilterState = {
  status: 'all' | 'in_stock' | 'on_sale'
  priceMin: number
  priceMax: number
  categories: string[]
  brands: string[]
  search: string
  sortBy: 'trending' | 'price_asc' | 'price_desc' | 'newest'
  viewMode: 'grid' | 'list'
  page: number
  perPage: number
}

// --- Mock Data ---
const brands = ['Apple', 'Samsung', 'Sony', 'LG', 'Dell', 'HP', 'Lenovo', 'Asus']

// --- CSS Constants ---
const slideInKeyframes = `@keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }`
const slideInRightKeyframes = `@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }`

// --- Responsive Hook ---
function useResponsive() {
  const [isDesktop, setIsDesktop] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkWidth = () => {
      const w = window.innerWidth
      setIsDesktop(w >= 1200)
      setIsTablet(w >= 768 && w < 1200)
      setIsMobile(w < 768)
    }
    checkWidth()
    window.addEventListener('resize', checkWidth)
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  return { isDesktop, isTablet, isMobile }
}

// --- Components ---

// 1. Mobile Menu Drawer
function MobileMenuDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        role="presentation"
        aria-label="Close menu"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 200,
        }}
      />
      {/* Drawer */}
      <div
        role="dialog"
        aria-label="Mobile menu"
        style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 280,
        height: '100vh',
        background: colors.canvas,
        zIndex: 201,
        boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
        animation: 'slideIn 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <style>{slideInKeyframes}</style>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${colors.hairlineSoft}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 28, height: 28, background: colors.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.onPrimary, fontWeight: 700, fontSize: 16 }}>C</div>
            <span style={{ fontSize: 16, fontWeight: 600, color: colors.ink }}>Menu</span>
          </div>
          <button onClick={onClose} style={{ width: 44, height: 44, borderRadius: rounded.pill, border: 'none', background: colors.surfaceSoft, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={20} height={20} fill="none" stroke={colors.ink} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Links */}
        <nav style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[{ label: 'Explore', href: '/store' }, { label: 'Deals', href: '/store?status=on_sale' }, { label: 'About Us', href: '/about' }, { label: 'Contact', href: '/contact' }].map((link) => (
            <Link key={link.label} href={link.href} style={{ padding: '14px 16px', borderRadius: 8, color: colors.ink, textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>{link.label}</Link>
          ))}
        </nav>
      </div>
    </>
  )
}

// 1. Navbar
function Navbar({ search, onSearchChange, onMenuToggle, isMobile: isMobileProp }: { search: string; onSearchChange: (v: string) => void; onMenuToggle?: () => void; isMobile?: boolean }) {
  const { itemCount, setIsOpen } = useCart()
  const isMobile = isMobileProp ?? false

  return (
    <header style={{ position: 'sticky', top: 0, background: colors.canvas, borderBottom: `1px solid ${colors.hairlineSoft}`, zIndex: 100, height: 60 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left: Logo + Hamburger (mobile) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isMobile && onMenuToggle && (
            <button onClick={onMenuToggle} aria-label="Open menu" style={{ width: 44, height: 44, borderRadius: rounded.pill, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={22} height={22} fill="none" stroke={colors.ink} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <div style={{ width: 28, height: 28, background: colors.primary, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.onPrimary, fontWeight: 700, fontSize: 16 }}>C</div>
          <span style={{ fontSize: 16, fontWeight: 600, color: colors.ink }}>CartHouse GH</span>
        </div>

        {/* Search (hidden on mobile) */}
        {!isMobile && (
          <div style={{ flex: 1, maxWidth: 320, position: 'relative' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ width: '100%', height: 44, borderRadius: rounded.pill, padding: '0 16px', boxSizing: 'border-box', border: `1px solid ${colors.hairline}`, background: colors.surfaceSoft, fontSize: 14, outline: 'none', color: colors.ink }}
            />
            <svg style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: colors.muted }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        )}

        {/* Nav Links & Cart (desktop) / Cart only (mobile) */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 20 }} aria-label="Main navigation">
          {!isMobile && (
            <>
              <Link href="/store" style={{ color: colors.ink, textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>Explore</Link>
              <Link href="/store?status=on_sale" style={{ color: colors.muted, textDecoration: 'none', fontSize: 15 }}>Deals</Link>
            </>
          )}
          <button onClick={() => setIsOpen(true)} style={{ width: 44, height: 44, borderRadius: rounded.pill, border: 'none', background: colors.surfaceSoft, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <svg width={20} height={20} fill="none" stroke={colors.ink} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {itemCount > 0 && (
              <span style={{ position: 'absolute', top: -2, right: -2, background: colors.primary, color: colors.onPrimary, fontSize: 10, fontWeight: 700, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{itemCount}</span>
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}

// 2. Sidebar Filter Panel
function Sidebar({ filters, onFilterChange, categories, products, onClearAll }: { filters: FilterState; onFilterChange: (f: Partial<FilterState>) => void; categories: Category[]; products: Product[]; onClearAll?: () => void }) {
  const [priceMin, setPriceMin] = useState(filters.priceMin.toString())
  const [priceMax, setPriceMax] = useState(filters.priceMax.toString())
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string) => {
    setExpandedCats(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const toggleCategory = (id: string) => {
    const newCats = filters.categories[0] === id ? [] : [id]
    onFilterChange({ categories: newCats, brands: [] })
  }

  const parentCategories = categories.filter((c) => c.children && c.children.length > 0)

  const availableBrands = useMemo(() => {
    if (filters.categories.length === 0) return []
    const catProducts = products.filter((p) => p.category && filters.categories.includes(p.category.id))
    return [...new Set(catProducts.map((p) => p.supplier?.name).filter(Boolean))] as string[]
  }, [products, filters.categories])

  return (
    <aside style={{ width: 240, paddingRight: 24, flexShrink: 0 }}>
      {/* Category Filter */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.ink, marginBottom: 12 }}>Category</h3>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {parentCategories.map((cat) => {
            const isOpen = expandedCats.has(cat.id)
            const children = cat.children || []
            return (
              <div key={cat.id}>
                <button
                  onClick={() => toggleExpand(cat.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', height: 36, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', padding: '0 4px', fontSize: 14, fontWeight: 600, color: colors.ink }}
                >
                  <svg width={12} height={12} fill="none" stroke={colors.muted} viewBox="0 0 24 24" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {cat.name}
                </button>
                {isOpen && children.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '4px 0 8px 20px' }}>
                    {children.map((child) => {
                      const selected = filters.categories.includes(child.id)
                      return (
                        <button
                          key={child.id}
                          onClick={() => toggleCategory(child.id)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: rounded.pill,
                            height: 32,
                            border: selected ? 'none' : `1px solid ${colors.hairline}`,
                            background: selected ? colors.ink : colors.surfaceSoft,
                            color: selected ? colors.canvas : colors.ink,
                            fontSize: 12,
                            fontWeight: selected ? 600 : 400,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {child.name}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Status Filter */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.ink, marginBottom: 12 }}>Status</h3>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['all', 'in_stock', 'on_sale'] as const).map((status) => (
            <button
              key={status}
              onClick={() => onFilterChange({ status })}
              style={{
                padding: '10px 16px',
                borderRadius: rounded.pill,
                height: 44,
                border: filters.status === status ? 'none' : `1px solid ${colors.hairline}`,
                background: filters.status === status ? colors.primary : colors.surfaceSoft,
                color: filters.status === status ? colors.onPrimary : colors.ink,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {status === 'all' ? 'All' : status === 'in_stock' ? 'In Stock' : 'On Sale'}
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.ink, marginBottom: 12 }}>Price (GH₵)</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="number"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            onBlur={() => onFilterChange({ priceMin: isNaN(parseInt(priceMin)) ? 0 : parseInt(priceMin) })}
            style={{ width: 80, height: 44, padding: '0 12px', borderRadius: rounded.pill, boxSizing: 'border-box', border: `1px solid ${colors.hairline}`, fontSize: 14, background: colors.surfaceSoft }}
            placeholder="0"
          />
          <span style={{ color: colors.muted, fontSize: 13 }}>to</span>
          <input
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            onBlur={() => onFilterChange({ priceMax: isNaN(parseInt(priceMax)) ? 10000 : parseInt(priceMax) })}
            style={{ width: 80, height: 44, padding: '0 12px', borderRadius: rounded.pill, boxSizing: 'border-box', border: `1px solid ${colors.hairline}`, fontSize: 14, background: colors.surfaceSoft }}
            placeholder="10000"
          />
        </div>
      </div>

{/* Brand Filter */}
      {availableBrands.length > 0 && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.ink, marginBottom: 12 }}>Brand</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {availableBrands.map((brand) => (
              <label key={brand} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 36, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={(e) => {
                    const newBrands = e.target.checked
                      ? [...filters.brands, brand]
                      : filters.brands.filter((b) => b !== brand)
                    onFilterChange({ brands: newBrands })
                  }}
                  style={{ width: 16, height: 16, borderRadius: 4, accentColor: colors.primary }}
                />
                <span style={{ fontSize: 14, color: colors.ink }}>{brand}</span>
              </label>
            ))}
          </div>
        </div>
)}

      {/* Clear All */}
      {onClearAll && (
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-start' }}>
          <button onClick={onClearAll} style={{ border: 'none', background: 'none', color: colors.primary, fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: '4px 0' }}>Clear all</button>
        </div>
      )}
    </aside>
  )
}

// 2b. Filter Drawer (mobile/tablet)
function FilterDrawer({ isOpen, onClose, filters, onFilterChange, categories, products, onClearAll }: {
  isOpen: boolean; onClose: () => void; filters: FilterState; onFilterChange: (f: Partial<FilterState>) => void; categories: Category[]; products: Product[]; onClearAll: () => void
}) {
  const [priceMin, setPriceMin] = useState(filters.priceMin.toString())
  const [priceMax, setPriceMax] = useState(filters.priceMax.toString())
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string) => {
    setExpandedCats(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

const toggleCategory = (id: string) => {
    const newCats = filters.categories[0] === id ? [] : [id]
    onFilterChange({ categories: newCats, brands: [] })
  }

  const parentCategories = categories.filter((c) => c.children && c.children.length > 0)

  const availableBrands = useMemo(() => {
    if (filters.categories.length === 0) return []
    const catProducts = products.filter((p) => p.category && filters.categories.includes(p.category.id))
    return [...new Set(catProducts.map((p) => p.supplier?.name).filter(Boolean))] as string[]
  }, [products, filters.categories])

  if (!isOpen) return null

  return (
    <>
      <style>{slideInRightKeyframes}</style>
      <div onClick={onClose} role="presentation" aria-label="Close filters" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200 }} />
      <div role="dialog" aria-label="Filters" style={{
        position: 'fixed', top: 0, right: 0, width: 300, height: '100vh', background: colors.canvas, zIndex: 201,
        boxShadow: '-4px 0 20px rgba(0,0,0,0.15)', animation: 'slideInRight 0.3s ease', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${colors.hairlineSoft}` }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: colors.ink }}>Filters</span>
          <button onClick={onClose} style={{ width: 44, height: 44, borderRadius: rounded.pill, border: 'none', background: colors.surfaceSoft, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={20} height={20} fill="none" stroke={colors.ink} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.ink, marginBottom: 12 }}>Category</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {parentCategories.map((cat) => {
                const isOpen = expandedCats.has(cat.id)
                const children = cat.children || []
                return (
                  <div key={cat.id}>
                    <button
                      onClick={() => toggleExpand(cat.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', height: 36, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', padding: '0 4px', fontSize: 14, fontWeight: 600, color: colors.ink }}
                    >
                      <svg width={12} height={12} fill="none" stroke={colors.muted} viewBox="0 0 24 24" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {cat.name}
                    </button>
                    {isOpen && children.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '4px 0 8px 20px' }}>
                        {children.map((child) => {
                          const selected = filters.categories.includes(child.id)
                          return (
                            <button
                              key={child.id}
                              onClick={() => toggleCategory(child.id)}
                              style={{
                                padding: '6px 14px',
                                borderRadius: rounded.pill,
                                height: 32,
                                border: selected ? 'none' : `1px solid ${colors.hairline}`,
                                background: selected ? colors.ink : colors.surfaceSoft,
                                color: selected ? colors.canvas : colors.ink,
                                fontSize: 12,
                                fontWeight: selected ? 600 : 400,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {child.name}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.ink, marginBottom: 12 }}>Status</h3>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['all', 'in_stock', 'on_sale'] as const).map((status) => (
                <button key={status} onClick={() => onFilterChange({ status })} style={{
                  padding: '10px 16px', borderRadius: rounded.pill, height: 44,
                  border: filters.status === status ? 'none' : `1px solid ${colors.hairline}`,
                  background: filters.status === status ? colors.primary : colors.surfaceSoft,
                  color: filters.status === status ? colors.onPrimary : colors.ink,
                  fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
                }}>{status === 'all' ? 'All' : status === 'in_stock' ? 'In Stock' : 'On Sale'}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.ink, marginBottom: 12 }}>Price (GH₵)</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} onBlur={() => onFilterChange({ priceMin: isNaN(parseInt(priceMin)) ? 0 : parseInt(priceMin) })} style={{ width: 80, height: 44, padding: '0 12px', borderRadius: rounded.pill, boxSizing: 'border-box', border: `1px solid ${colors.hairline}`, fontSize: 14, background: colors.surfaceSoft }} placeholder="0" />
              <span style={{ color: colors.muted, fontSize: 13 }}>to</span>
              <input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} onBlur={() => onFilterChange({ priceMax: isNaN(parseInt(priceMax)) ? 10000 : parseInt(priceMax) })} style={{ width: 80, height: 44, padding: '0 12px', borderRadius: rounded.pill, boxSizing: 'border-box', border: `1px solid ${colors.hairline}`, fontSize: 14, background: colors.surfaceSoft }} placeholder="10000" />
            </div>
          </div>
          {availableBrands.length > 0 && (
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.ink, marginBottom: 12 }}>Brand</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {availableBrands.map((brand) => (
                  <label key={brand} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 36, cursor: 'pointer' }}>
                    <input type="checkbox" checked={filters.brands.includes(brand)} onChange={(e) => {
                      const newBrands = e.target.checked ? [...filters.brands, brand] : filters.brands.filter((b) => b !== brand)
                      onFilterChange({ brands: newBrands })
                    }} style={{ width: 16, height: 16, borderRadius: 4, accentColor: colors.primary }} />
                    <span style={{ fontSize: 14, color: colors.ink }}>{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{ padding: '16px 20px', borderTop: `1px solid ${colors.hairlineSoft}`, display: 'flex', gap: 12 }}>
          <button onClick={onClearAll} style={{ flex: 1, padding: '12px 16px', borderRadius: rounded.pill, height: 44, border: `1px solid ${colors.hairline}`, background: colors.canvas, fontSize: 14, cursor: 'pointer' }}>Clear all</button>
          <button onClick={onClose} style={{ flex: 1, padding: '12px 16px', borderRadius: rounded.pill, height: 44, border: 'none', background: colors.primary, color: colors.onPrimary, fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>Apply</button>
        </div>
      </div>
    </>
  )
}

// 3. Toolbar
function Toolbar({ filters, onFilterChange, onOpenFilters, showFiltersButton, onClearAll, isDesktop }: { filters: FilterState; onFilterChange: (f: Partial<FilterState>) => void; onOpenFilters?: () => void; showFiltersButton?: boolean; onClearAll?: () => void; isDesktop: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, height: 48, padding: '8px 0' }}>
{/* Sort Dropdown */}
      <div style={{ position: 'relative' }}>
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
          style={{ padding: '8px 36px 8px 12px', height: 44, borderRadius: rounded.pill, border: `1px solid ${colors.hairline}`, background: colors.canvas, fontSize: 13, cursor: 'pointer', minWidth: 120, color: colors.ink, flexShrink: 0, appearance: 'none' }}
        >
          <option value="trending">Trending</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="newest">Newest</option>
        </select>
        <svg style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: colors.muted, pointerEvents: 'none' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
        </svg>
</div>

      {showFiltersButton && (
        <button onClick={onOpenFilters} style={{ height: 44, padding: '0 20px', borderRadius: rounded.pill, border: `1px solid ${colors.hairline}`, background: colors.canvas, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: colors.ink, flexShrink: 0 }}>
          <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          Filters
        </button>
      )}

      {/* View Toggle */}
      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        <button
          onClick={() => onFilterChange({ viewMode: 'grid' })}
          title="Grid view"
          style={{ width: 44, height: 44, borderRadius: rounded.pill, border: `1px solid ${colors.hairline}`, background: filters.viewMode === 'grid' ? colors.surfaceSoft : colors.canvas, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width={18} height={18} fill={colors.muted} viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="8" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" /><rect x="13" y="13" width="8" height="8" rx="1" /></svg>
        </button>
        <button
          onClick={() => onFilterChange({ viewMode: 'list' })}
          title="List view"
          style={{ width: 44, height: 44, borderRadius: rounded.pill, border: `1px solid ${colors.hairline}`, background: filters.viewMode === 'list' ? colors.surfaceSoft : colors.canvas, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width={18} height={18} fill={colors.muted} viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="2" rx="1" /><rect x="4" y="11" width="16" height="2" rx="1" /><rect x="4" y="17" width="16" height="2" rx="1" /></svg>
        </button>
      </div>

      </div>
  )
}

// 4. Product Card
function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: () => void }) {
  return (
    <a
      href={`/store/products/${product.slug}`}
      style={{ background: colors.canvas, border: `1px solid ${colors.hairlineSoft}`, borderRadius: rounded.xl, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s', textDecoration: 'none', display: 'block' }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
    >
      {/* Image */}
      <div style={{ aspectRatio: '1/1', background: colors.surfaceSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {product.media[0] ? (
          <img src={product.media[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 16 }} />
        ) : (
          <svg width={48} height={48} fill={colors.muted} viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6z" /></svg>
        )}
        {/* Download icon */}
        <button style={{ position: 'absolute', bottom: 8, right: 8, width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'rgba(10,19,23,0.12)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={14} height={14} fill={colors.muted} viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" /></svg>
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '10px 12px' }}>
        {/* Brand */}
        {product.category && <span style={{ fontSize: 11, color: colors.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{product.category.name}</span>}
        
        {/* Name */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: colors.ink, maxWidth: '80%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</span>
          <span style={{ color: colors.muted, fontSize: 16 }}>···</span>
        </div>

        {/* Price */}
        <div style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>GH₵{product.price.toFixed(2)}</div>

        {/* Stock badge */}
        {product.stock > 0 ? (
          <span style={{ display: 'inline-block', marginTop: 4, padding: '2px 8px', borderRadius: rounded.pill, background: colors.semanticUp, color: colors.canvas, fontSize: 10 }}>In Stock</span>
        ) : (
          <span style={{ display: 'inline-block', marginTop: 4, padding: '2px 8px', borderRadius: rounded.pill, background: colors.semanticDown, color: colors.canvas, fontSize: 10 }}>Out of Stock</span>
        )}
      </div>
    </a>
  )
}

// 4b. Product Card (Horizontal / List View)
function ProductCardHorizontal({ product }: { product: Product }) {
  return (
    <a
      href={`/store/products/${product.slug}`}
      style={{ background: colors.canvas, border: `1px solid ${colors.hairlineSoft}`, borderRadius: rounded.xl, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s', textDecoration: 'none', display: 'flex', maxWidth: 500 }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
    >
      <div style={{ width: 80, height: 80, flexShrink: 0, background: colors.surfaceSoft, overflow: 'hidden' }}>
        {product.media[0] ? (
          <img src={product.media[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <svg width={48} height={48} fill={colors.muted} viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6z" /></svg>
        )}
      </div>
      <div style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {product.category && <span style={{ fontSize: 11, color: colors.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{product.category.name}</span>}
        <span style={{ fontSize: 14, fontWeight: 600, color: colors.ink }}>{product.name}</span>
        {product.description && <span style={{ fontSize: 12, color: colors.charcoal, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</span>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: colors.ink }}>GH₵{product.price.toFixed(2)}</span>
          {product.stock > 0 ? (
            <span style={{ padding: '1px 6px', borderRadius: rounded.pill, background: colors.semanticUp, color: colors.canvas, fontSize: 10 }}>In Stock</span>
          ) : (
            <span style={{ padding: '1px 6px', borderRadius: rounded.pill, background: colors.semanticDown, color: colors.canvas, fontSize: 10 }}>Out of Stock</span>
          )}
        </div>
      </div>
    </a>
  )
}

// 5. Product Grid
function ProductGrid({ products, viewMode, isDesktop, isTablet, isMobile, onAddToCart }: { products: Product[]; viewMode: 'grid' | 'list'; isDesktop: boolean; isTablet: boolean; isMobile: boolean; onAddToCart: (p: Product) => void }) {
  if (viewMode === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {products.map((product) => (
          <ProductCardHorizontal key={product.id} product={product} />
        ))}
      </div>
    )
  }
  const cols = (() => {
    if (isMobile) return 2
    if (isTablet) return 2
    return 4
  })()
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 12 }}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={() => onAddToCart(product)} />
      ))}
    </div>
  )
}

// 6. Pagination
function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
  if (totalPages <= 1) return null
  
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages, start + maxVisible - 1)
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 32 }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{ padding: '10px 16px', borderRadius: rounded.pill, height: 44, border: `1px solid ${colors.hairline}`, background: colors.canvas, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
      >
        <svg width={16} height={16} fill="none" stroke={colors.muted} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      
      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} style={{ padding: '10px 16px', borderRadius: rounded.pill, height: 44, border: 'none', background: 'transparent', color: colors.muted, cursor: 'pointer' }}>1</button>
          {start > 2 && <span style={{ color: colors.muted }}>...</span>}
        </>
      )}
      
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            padding: '10px 16px',
            borderRadius: rounded.pill,
            height: 44,
            border: currentPage === page ? 'none' : `1px solid ${colors.hairline}`,
            background: currentPage === page ? colors.ink : colors.canvas,
            color: currentPage === page ? colors.canvas : colors.muted,
            cursor: 'pointer',
            fontWeight: currentPage === page ? 600 : 400,
          }}
        >
          {page}
        </button>
      ))}
      
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span style={{ color: colors.muted }}>...</span>}
          <button onClick={() => onPageChange(totalPages)} style={{ padding: '10px 16px', borderRadius: rounded.pill, height: 44, border: 'none', background: 'transparent', color: colors.muted, cursor: 'pointer' }}>{totalPages}</button>
        </>
      )}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{ padding: '10px 16px', borderRadius: rounded.pill, height: 44, border: `1px solid ${colors.hairline}`, background: colors.canvas, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
      >
        <svg width={16} height={16} fill="none" stroke={colors.muted} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  )
}

// 6. Footer
const deepBlue = '#0B1D3A'

function Footer() {
  return (
    <footer style={{ background: deepBlue, padding: '64px 24px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: colors.onPrimary, marginBottom: 16 }}>CartHouse GH</div>
          <p style={{ fontSize: 14, color: '#ffffffcc', lineHeight: 1.6 }}>Your trusted destination for premium electronics and gadgets in Ghana.</p>
        </div>
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: colors.onPrimary }}>Contact</h4>
<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <PhoneIcon size={16} color="#ffffffcc" />
            <span style={{ fontSize: 14, color: '#ffffffcc' }}>+233 20 123 4567</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <MailIcon size={16} color="#ffffffcc" />
            <span style={{ fontSize: 14, color: '#ffffffcc' }}>info@carthousegh.com</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LocationIcon size={16} color="#ffffffcc" />
            <span style={{ fontSize: 14, color: '#ffffffcc' }}>Accra, Ghana</span>
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: colors.onPrimary }}>Quick Links</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[{ label: 'About Us', href: '/about' }, { label: 'Shop', href: '/store' }, { label: 'Deals', href: '/store?status=on_sale' }, { label: 'Contact', href: '/contact' }].map((link) => (
              <Link key={link.label} href={link.href} style={{ fontSize: 14, color: '#ffffffcc', textDecoration: 'none' }}>{link.label}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: colors.onPrimary }}>Follow Us</h4>
          <div style={{ display: 'flex', gap: 12 }}>
<a href="#" aria-label="Facebook" style={{ width: 44, height: 44, borderRadius: rounded.pill, border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffffcc' }}>
              <FacebookIcon size={18} color="#ffffffcc" />
            </a>
            <a href="#" aria-label="Instagram" style={{ width: 44, height: 44, borderRadius: rounded.pill, border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffffcc' }}>
              <InstagramIcon size={18} color="#ffffffcc" />
            </a>
            <a href="#" aria-label="Twitter" style={{ width: 44, height: 44, borderRadius: rounded.pill, border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffffcc' }}>
              <TwitterIcon size={18} color="#ffffffcc" />
            </a>
            <a href="#" aria-label="WhatsApp" style={{ width: 44, height: 44, borderRadius: rounded.pill, border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffffcc' }}>
              <WhatsAppIcon size={18} color="#ffffffcc" />
            </a>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1400, margin: '32px auto 0', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#ffffff99' }}>&copy; 2026 CartHouse GH. All rights reserved.</p>
      </div>
    </footer>
  )
}

// --- Main Page ---
function StorefrontPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addItem } = useCart()
  const { isDesktop, isTablet, isMobile } = useResponsive()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => fetch('/api/public/categories').then((r) => r.json()),
  })

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => fetch('/api/public/products?limit=100').then((r) => r.json()),
  })
  
  const [filters, setFilters] = useState<FilterState>({
    status: (searchParams.get('status') as FilterState['status']) || 'all',
    priceMin: parseInt(searchParams.get('priceMin') || '0'),
    priceMax: parseInt(searchParams.get('priceMax') || '10000'),
    categories: searchParams.get('categories')?.split(',').filter(Boolean) || [],
    brands: searchParams.get('brands')?.split(',').filter(Boolean) || [],
    search: searchParams.get('search') || '',
    sortBy: (searchParams.get('sortBy') as FilterState['sortBy']) || 'trending',
    viewMode: (searchParams.get('viewMode') as FilterState['viewMode']) || 'grid',
    page: parseInt(searchParams.get('page') || '1'),
    perPage: 20,
  })

  const filteredProducts = useMemo(() => {
    let result = [...products]
    
    if (filters.status === 'in_stock') result = result.filter((p) => p.stock > 0)
    if (filters.status === 'on_sale') result = result.filter((p) => p.isAvailable)
    result = result.filter((p) => p.price >= filters.priceMin && p.price <= filters.priceMax)
    if (filters.categories.length > 0) result = result.filter((p) => p.category && filters.categories.includes(p.category.id))
    if (filters.brands.length > 0) result = result.filter((p) => p.supplier && filters.brands.includes(p.supplier.name))
    if (filters.search) result = result.filter((p) => p.name.toLowerCase().includes(filters.search.toLowerCase()))
    
    if (filters.sortBy === 'price_asc') result.sort((a, b) => a.price - b.price)
    if (filters.sortBy === 'price_desc') result.sort((a, b) => b.price - a.price)
    if (filters.sortBy === 'newest') result.sort((a, b) => 0)
    
    return result
  }, [products, filters])

  const paginatedProducts = useMemo(() => {
    const start = (filters.page - 1) * filters.perPage
    return filteredProducts.slice(start, start + filters.perPage)
  }, [filteredProducts, filters.page, filters.perPage])

  const totalPages = Math.ceil(filteredProducts.length / filters.perPage)

  const updateURL = (update: Partial<FilterState>) => {
    const params = new URLSearchParams()
    if (update.status && update.status !== 'all') params.set('status', update.status)
    if (update.priceMin && update.priceMin > 0) params.set('priceMin', update.priceMin.toString())
    if (update.priceMax && update.priceMax < 10000) params.set('priceMax', update.priceMax.toString())
    if (update.categories?.length) params.set('categories', update.categories.join(','))
    if (update.brands?.length) params.set('brands', update.brands.join(','))
    if (update.search) params.set('search', update.search)
    if (update.sortBy && update.sortBy !== 'trending') params.set('sortBy', update.sortBy)
    if (update.viewMode && update.viewMode !== 'grid') params.set('viewMode', update.viewMode)
    if (update.page && update.page > 1) params.set('page', update.page.toString())
    
    const query = params.toString()
    router.push(query ? `/store?${query}` : '/store', { scroll: false })
  }

  const handleFilterChange = (update: Partial<FilterState>) => {
    if (update.page === undefined) {
      update.page = 1
    }
    setFilters((prev) => ({ ...prev, ...update }))
    updateURL(update)
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.media[0] || null,
      maxStock: product.stock,
    })
  }

  const handleClearAll = () => {
    handleFilterChange({ status: 'all', priceMin: 0, priceMax: 10000, categories: [], brands: [], search: '' })
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: colors.canvas, color: colors.ink, minHeight: '100vh' }}>
      <Navbar search={filters.search} onSearchChange={(v) => handleFilterChange({ search: v })} onMenuToggle={() => setIsMobileMenuOpen(true)} isMobile={isMobile} />

      <MobileMenuDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        categories={categories}
        products={products}
        onClearAll={handleClearAll}
      />

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'flex' }}>
          {isDesktop && <Sidebar filters={filters} onFilterChange={handleFilterChange} categories={categories} products={products} onClearAll={handleClearAll} />}

          <div style={{ flex: 1 }}>
            <Toolbar filters={filters} onFilterChange={handleFilterChange} showFiltersButton={!isDesktop} onOpenFilters={() => setIsFilterDrawerOpen(true)} onClearAll={handleClearAll} isDesktop={isDesktop} />
            <ProductGrid products={paginatedProducts} viewMode={filters.viewMode} isDesktop={isDesktop} isTablet={isTablet} isMobile={isMobile} onAddToCart={handleAddToCart} />
            <Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={(p) => handleFilterChange({ page: p })} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function StorefrontWithSuspense() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <StorefrontPage />
    </Suspense>
  )
}

export default StorefrontWithSuspense