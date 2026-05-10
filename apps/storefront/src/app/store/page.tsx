'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/lib/cart'

// Meta Design System Colors
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

// --- Types ---
interface Category {
  id: string
  name: string
  slug: string
  parentId: string | null
  imageUrl: string | null
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
  viewMode: 'grid_3' | 'grid_2'
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
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: colors.surfaceSoft, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
            <button onClick={onMenuToggle} aria-label="Open menu" style={{ width: 40, height: 40, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
              style={{ width: '100%', height: 38, padding: '0 12px 0 12px', borderRadius: 8, border: `1px solid ${colors.hairline}`, background: colors.surfaceSoft, fontSize: 14, outline: 'none', color: colors.ink }}
            />
            <svg style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: colors.steel }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        )}

        {/* Nav Links & Cart (desktop) / Cart only (mobile) */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 20 }} aria-label="Main navigation">
          {!isMobile && (
            <>
              <Link href="/store" style={{ color: colors.ink, textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>Explore</Link>
              <Link href="/store?status=on_sale" style={{ color: colors.steel, textDecoration: 'none', fontSize: 15 }}>Deals</Link>
            </>
          )}
          <button onClick={() => setIsOpen(true)} style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: colors.surfaceSoft, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
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
function Sidebar({ filters, onFilterChange, categories }: { filters: FilterState; onFilterChange: (f: Partial<FilterState>) => void; categories: Category[] }) {
  const [priceMin, setPriceMin] = useState(filters.priceMin.toString())
  const [priceMax, setPriceMax] = useState(filters.priceMax.toString())

  return (
    <aside style={{ width: 240, paddingRight: 24, flexShrink: 0 }}>
      {/* Category Filter */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.ink, marginBottom: 12 }}>Category</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {categories.slice(0, 8).map((cat) => (
            <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 36, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={filters.categories.includes(cat.id)}
                onChange={(e) => {
                  const newCats = e.target.checked
                    ? [...filters.categories, cat.id]
                    : filters.categories.filter((id) => id !== cat.id)
                  onFilterChange({ categories: newCats })
                }}
                style={{ width: 16, height: 16, borderRadius: 4, accentColor: colors.primary }}
              />
              <span style={{ fontSize: 14, color: colors.ink }}>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.ink, marginBottom: 12 }}>Status</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['all', 'in_stock', 'on_sale'] as const).map((status) => (
            <button
              key={status}
              onClick={() => onFilterChange({ status })}
              style={{
                padding: '6px 16px',
                borderRadius: 20,
                border: filters.status === status ? 'none' : `1px solid ${colors.hairline}`,
                background: filters.status === status ? colors.inkDeep : colors.canvas,
                color: filters.status === status ? colors.canvas : colors.charcoal,
                fontSize: 13,
                cursor: 'pointer',
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
            style={{ width: 80, padding: '8px', borderRadius: 8, border: `1px solid ${colors.hairline}`, fontSize: 14, background: colors.surfaceSoft }}
            placeholder="0"
          />
          <span style={{ color: colors.steel, fontSize: 13 }}>to</span>
          <input
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
onBlur={() => onFilterChange({ priceMax: isNaN(parseInt(priceMax)) ? 10000 : parseInt(priceMax) })}
            style={{ width: 80, padding: '8px', borderRadius: 8, border: `1px solid ${colors.hairline}`, fontSize: 14, background: colors.surfaceSoft }}
            placeholder="10000"
          />
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.ink, marginBottom: 12 }}>Brand</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {brands.map((brand) => (
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
    </aside>
  )
}

// 2b. Filter Drawer (mobile/tablet)
function FilterDrawer({ isOpen, onClose, filters, onFilterChange, categories, onClearAll }: {
  isOpen: boolean; onClose: () => void; filters: FilterState; onFilterChange: (f: Partial<FilterState>) => void; categories: Category[]; onClearAll: () => void
}) {
  const [priceMin, setPriceMin] = useState(filters.priceMin.toString())
  const [priceMax, setPriceMax] = useState(filters.priceMax.toString())

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
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: colors.surfaceSoft, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={20} height={20} fill="none" stroke={colors.ink} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.ink, marginBottom: 12 }}>Category</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {categories.slice(0, 8).map((cat) => (
                <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 36, cursor: 'pointer' }}>
                  <input type="checkbox" checked={filters.categories.includes(cat.id)} onChange={(e) => {
                    const newCats = e.target.checked ? [...filters.categories, cat.id] : filters.categories.filter((id) => id !== cat.id)
                    onFilterChange({ categories: newCats })
                  }} style={{ width: 16, height: 16, borderRadius: 4, accentColor: colors.primary }} />
                  <span style={{ fontSize: 14, color: colors.ink }}>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.ink, marginBottom: 12 }}>Status</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['all', 'in_stock', 'on_sale'] as const).map((status) => (
                <button key={status} onClick={() => onFilterChange({ status })} style={{
                  padding: '6px 16px', borderRadius: 20,
                  border: filters.status === status ? 'none' : `1px solid ${colors.hairline}`,
                  background: filters.status === status ? colors.inkDeep : colors.canvas,
                  color: filters.status === status ? colors.canvas : colors.charcoal,
                  fontSize: 13, cursor: 'pointer',
                }}>{status === 'all' ? 'All' : status === 'in_stock' ? 'In Stock' : 'On Sale'}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.ink, marginBottom: 12 }}>Price (GH₵)</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} onBlur={() => onFilterChange({ priceMin: isNaN(parseInt(priceMin)) ? 0 : parseInt(priceMin) })} style={{ width: 80, padding: '8px', borderRadius: 8, border: `1px solid ${colors.hairline}`, fontSize: 14, background: colors.surfaceSoft }} placeholder="0" />
              <span style={{ color: colors.steel, fontSize: 13 }}>to</span>
              <input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} onBlur={() => onFilterChange({ priceMax: isNaN(parseInt(priceMax)) ? 10000 : parseInt(priceMax) })} style={{ width: 80, padding: '8px', borderRadius: 8, border: `1px solid ${colors.hairline}`, fontSize: 14, background: colors.surfaceSoft }} placeholder="10000" />
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.ink, marginBottom: 12 }}>Brand</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {brands.map((brand) => (
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
        </div>
        <div style={{ padding: '16px 20px', borderTop: `1px solid ${colors.hairlineSoft}`, display: 'flex', gap: 12 }}>
          <button onClick={onClearAll} style={{ flex: 1, padding: '12px', borderRadius: 8, border: `1px solid ${colors.hairline}`, background: colors.canvas, fontSize: 14, cursor: 'pointer' }}>Clear all</button>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: 8, border: 'none', background: colors.primary, color: colors.onPrimary, fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>Apply</button>
        </div>
      </div>
    </>
  )
}

// 3. Toolbar
function Toolbar({ filters, onFilterChange, onOpenFilters, showFiltersButton }: { filters: FilterState; onFilterChange: (f: Partial<FilterState>) => void; onOpenFilters?: () => void; showFiltersButton?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 48, padding: '8px 0' }}>
      {showFiltersButton ? (
        <button onClick={onOpenFilters} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: `1px solid ${colors.hairline}`, background: colors.canvas, fontSize: 14, cursor: 'pointer' }}>
          <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          Filters
        </button>
      ) : (
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: `1px solid ${colors.hairline}`, background: colors.canvas, fontSize: 14, cursor: 'pointer' }}>
          <svg width={12} height={12} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Filters
          <span style={{ background: colors.primary, color: colors.onPrimary, fontSize: 10, width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
        </button>
      )}

      {/* Clear All */}
      <button style={{ border: 'none', background: 'none', color: colors.ink, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Clear all</button>

      {/* Refresh */}
      <button style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${colors.hairline}`, background: colors.canvas, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={16} height={16} fill="none" stroke={colors.steel} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
      </button>

      {/* Inline Search */}
      <div style={{ flex: 1, position: 'relative' }}>
        <input
          type="text"
          placeholder="Search by products"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          style={{ width: '100%', height: 38, padding: '0 12px 0 36px', borderRadius: 8, border: `1px solid ${colors.hairline}`, background: colors.canvas, fontSize: 14, outline: 'none', color: colors.ink }}
        />
        <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: colors.steel }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Sort Dropdown */}
      <select
        value={filters.sortBy}
        onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
        style={{ padding: '8px 14px', borderRadius: 8, border: `1px solid ${colors.hairline}`, background: colors.canvas, fontSize: 14, cursor: 'pointer', minWidth: 130, color: colors.ink }}
      >
        <option value="trending">Trending</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="newest">Newest</option>
      </select>

      {/* View Toggle */}
      <div style={{ display: 'flex', gap: 0 }}>
        <button
          onClick={() => onFilterChange({ viewMode: 'grid_3' })}
          style={{ width: 34, height: 34, borderRadius: '8px 0 0 8px', border: `1px solid ${colors.hairline}`, background: filters.viewMode === 'grid_3' ? colors.surfaceSoft : colors.canvas, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width={16} height={16} fill={colors.steel} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
        </button>
        <button
          onClick={() => onFilterChange({ viewMode: 'grid_2' })}
          style={{ width: 34, height: 34, borderRadius: '0 8px 8px 0', border: `1px solid ${colors.hairline}`, borderLeft: 'none', background: filters.viewMode === 'grid_2' ? colors.surfaceSoft : colors.canvas, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width={16} height={16} fill={colors.steel} viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="18" /><rect x="13" y="3" width="8" height="18" /></svg>
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
      style={{ background: colors.canvas, border: `1px solid ${colors.hairlineSoft}`, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s', textDecoration: 'none', display: 'block' }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
    >
      {/* Image */}
      <div style={{ aspectRatio: '1/1', background: colors.surfaceSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {product.media[0] ? (
          <img src={product.media[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 16 }} />
        ) : (
          <svg width={48} height={48} fill={colors.steel} viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6z" /></svg>
        )}
        {/* Download icon */}
        <button style={{ position: 'absolute', bottom: 8, right: 8, width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'rgba(10,19,23,0.12)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={14} height={14} fill={colors.steel} viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" /></svg>
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '10px 12px' }}>
        {/* Brand */}
        {product.category && <span style={{ fontSize: 11, color: colors.steel, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{product.category.name}</span>}
        
        {/* Name */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: colors.ink, maxWidth: '80%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</span>
          <span style={{ color: colors.steel, fontSize: 16 }}>···</span>
        </div>

        {/* Price */}
        <div style={{ fontSize: 12, color: colors.charcoal, marginTop: 2 }}>GH₵{product.price.toFixed(2)}</div>

        {/* Stock badge */}
        {product.stock > 0 ? (
          <span style={{ display: 'inline-block', marginTop: 4, padding: '2px 8px', borderRadius: 20, background: colors.success, color: colors.canvas, fontSize: 10 }}>In Stock</span>
        ) : (
          <span style={{ display: 'inline-block', marginTop: 4, padding: '2px 8px', borderRadius: 20, background: colors.critical, color: colors.canvas, fontSize: 10 }}>Out of Stock</span>
        )}
      </div>
    </a>
  )
}

// 5. Product Grid
function ProductGrid({ products, viewMode, isDesktop, isTablet, isMobile, onAddToCart }: { products: Product[]; viewMode: 'grid_3' | 'grid_2'; isDesktop: boolean; isTablet: boolean; isMobile: boolean; onAddToCart: (p: Product) => void }) {
  const cols = (() => {
    if (isMobile) return 2
    if (isTablet) return 3
    return viewMode === 'grid_3' ? 4 : 2
  })()
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }}>
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
        style={{ padding: '8px 14px', borderRadius: 8, border: `1px solid ${colors.hairline}`, background: colors.canvas, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
      >
        <svg width={16} height={16} fill="none" stroke={colors.charcoal} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      
      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: 'transparent', color: colors.charcoal, cursor: 'pointer' }}>1</button>
          {start > 2 && <span style={{ color: colors.steel }}>...</span>}
        </>
      )}
      
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            padding: '8px 14px',
            borderRadius: 8,
            border: currentPage === page ? 'none' : `1px solid ${colors.hairline}`,
            background: currentPage === page ? colors.inkDeep : colors.canvas,
            color: currentPage === page ? colors.canvas : colors.charcoal,
            cursor: 'pointer',
            fontWeight: currentPage === page ? 600 : 400,
          }}
        >
          {page}
        </button>
      ))}
      
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span style={{ color: colors.steel }}>...</span>}
          <button onClick={() => onPageChange(totalPages)} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: 'transparent', color: colors.charcoal, cursor: 'pointer' }}>{totalPages}</button>
        </>
      )}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{ padding: '8px 14px', borderRadius: 8, border: `1px solid ${colors.hairline}`, background: colors.canvas, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
      >
        <svg width={16} height={16} fill="none" stroke={colors.charcoal} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  )
}

// 6. Footer
function Footer() {
  return (
    <footer style={{ background: colors.canvas, borderTop: `1px solid ${colors.hairlineSoft}`, padding: '64px 24px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: colors.primary, marginBottom: 16 }}>CartHouse GH</div>
          <p style={{ fontSize: 14, color: colors.steel, lineHeight: 1.6 }}>Your trusted destination for premium electronics and gadgets in Ghana.</p>
        </div>
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: colors.ink }}>Contact</h4>
          <p style={{ fontSize: 14, color: colors.steel, marginBottom: 8 }}>📞 +233 20 123 4567</p>
          <p style={{ fontSize: 14, color: colors.steel, marginBottom: 8 }}>📧 info@carthousegh.com</p>
          <p style={{ fontSize: 14, color: colors.steel }}>📍 Accra, Ghana</p>
        </div>
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: colors.ink }}>Quick Links</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[{ label: 'About Us', href: '/about' }, { label: 'Shop', href: '/store' }, { label: 'Deals', href: '/store?status=on_sale' }, { label: 'Contact', href: '/contact' }].map((link) => (
              <Link key={link.label} href={link.href} style={{ fontSize: 14, color: colors.steel, textDecoration: 'none' }}>{link.label}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: colors.ink }}>Follow Us</h4>
          <div style={{ display: 'flex', gap: 12 }}>
            {['FB', 'IG', 'X', 'WA'].map((social) => (
              <span key={social} style={{ width: 36, height: 36, borderRadius: '50%', border: `1px solid ${colors.hairlineSoft}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.steel, fontSize: 12 }}>{social}</span>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1400, margin: '32px auto 0', paddingTop: 24, borderTop: `1px solid ${colors.hairlineSoft}`, textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: colors.stone }}>© 2026 CartHouse GH. All rights reserved.</p>
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
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  
  const [filters, setFilters] = useState<FilterState>({
    status: (searchParams.get('status') as FilterState['status']) || 'all',
    priceMin: parseInt(searchParams.get('priceMin') || '0'),
    priceMax: parseInt(searchParams.get('priceMax') || '10000'),
    categories: searchParams.get('categories')?.split(',').filter(Boolean) || [],
    brands: searchParams.get('brands')?.split(',').filter(Boolean) || [],
    search: searchParams.get('search') || '',
    sortBy: (searchParams.get('sortBy') as FilterState['sortBy']) || 'trending',
    viewMode: (searchParams.get('viewMode') as FilterState['viewMode']) || 'grid_3',
    page: parseInt(searchParams.get('page') || '1'),
    perPage: 20,
  })

  useEffect(() => {
    fetch('/api/public/categories').then((r) => r.json()).then((d) => setCategories(d)).catch(console.error)
    fetch('/api/public/products?limit=100').then((r) => r.json()).then((d) => setProducts(d)).catch(console.error)
  }, [])

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
    if (update.viewMode && update.viewMode !== 'grid_3') params.set('viewMode', update.viewMode)
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
        onClearAll={handleClearAll}
      />

      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'flex' }}>
          {isDesktop && <Sidebar filters={filters} onFilterChange={handleFilterChange} categories={categories} />}

          <div style={{ flex: 1 }}>
            <Toolbar filters={filters} onFilterChange={handleFilterChange} showFiltersButton={!isDesktop} onOpenFilters={() => setIsFilterDrawerOpen(true)} />
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