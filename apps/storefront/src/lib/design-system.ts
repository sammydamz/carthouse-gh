'use client'

// Coinbase Design System — single source of truth for all storefront components

export const colors = {
  // Brand
  primary: '#0052ff',
  primaryActive: '#003ecc',
  primaryDisabled: '#a8b8cc',
  // Surfaces
  canvas: '#ffffff',
  surfaceSoft: '#f7f7f7',
  surfaceStrong: '#eef0f3',
  surfaceCard: '#ffffff',
  surfaceDark: '#0a0b0d',
  surfaceDarkElevated: '#16181c',
  // Text
  ink: '#0a0b0d',
  body: '#5b616e',
  bodyStrong: '#0a0b0d',
  muted: '#7c828a',
  mutedSoft: '#a8acb3',
  onPrimary: '#ffffff',
  onDark: '#ffffff',
  onDarkSoft: '#a8acb3',
  // Hairlines
  hairline: '#dee1e6',
  hairlineSoft: '#eef0f3',
  // Semantic
  semanticUp: '#05b169',
  semanticDown: '#cf202f',
  accentYellow: '#f4b000',
}

// Typography helpers (Coinbase Sans/Display)
export const type = {
  displayMega: (s: React.CSSProperties = {}) => ({ fontFamily: "'Coinbase Display', -apple-system, system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 80, fontWeight: 400, lineHeight: 1.0, letterSpacing: '-2px', ...s } as React.CSSProperties),
  displayLg: (s: React.CSSProperties = {}) => ({ fontFamily: "'Coinbase Display', -apple-system, system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 52, fontWeight: 400, lineHeight: 1.0, letterSpacing: '-1.3px', ...s } as React.CSSProperties),
  displaySm: (s: React.CSSProperties = {}) => ({ fontFamily: "'Coinbase Sans', -apple-system, system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 36, fontWeight: 400, lineHeight: 1.11, letterSpacing: '-0.5px', ...s } as React.CSSProperties),
  titleLg: (s: React.CSSProperties = {}) => ({ fontFamily: "'Coinbase Sans', -apple-system, system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 32, fontWeight: 400, lineHeight: 1.13, letterSpacing: '-0.4px', ...s } as React.CSSProperties),
  titleMd: (s: React.CSSProperties = {}) => ({ fontFamily: "'Coinbase Sans', -apple-system, system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 18, fontWeight: 600, lineHeight: 1.33, ...s } as React.CSSProperties),
  body: (s: React.CSSProperties = {}) => ({ fontFamily: "'Coinbase Sans', -apple-system, system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 16, fontWeight: 400, lineHeight: 1.5, ...s } as React.CSSProperties),
  bodySm: (s: React.CSSProperties = {}) => ({ fontFamily: "'Coinbase Sans', -apple-system, system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 14, fontWeight: 400, lineHeight: 1.5, ...s } as React.CSSProperties),
  caption: (s: React.CSSProperties = {}) => ({ fontFamily: "'Coinbase Sans', -apple-system, system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 13, fontWeight: 400, lineHeight: 1.5, ...s } as React.CSSProperties),
  captionStrong: (s: React.CSSProperties = {}) => ({ fontFamily: "'Coinbase Sans', -apple-system, system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 12, fontWeight: 600, lineHeight: 1.5, ...s } as React.CSSProperties),
  button: (s: React.CSSProperties = {}) => ({ fontFamily: "'Coinbase Sans', -apple-system, system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 16, fontWeight: 600, lineHeight: 1.15, ...s } as React.CSSProperties),
  navLink: (s: React.CSSProperties = {}) => ({ fontFamily: "'Coinbase Sans', -apple-system, system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 14, fontWeight: 500, lineHeight: 1.4, ...s } as React.CSSProperties),
  numberDisplay: (s: React.CSSProperties = {}) => ({ fontFamily: "'Coinbase Mono', 'Coinbase Sans', monospace", fontSize: 18, fontWeight: 500, lineHeight: 1.4, ...s } as React.CSSProperties),
}

// Shape / border-radius tokens
export const rounded = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 100,
  full: 9999,
}

// Spacing tokens (px)
export const sp = {
  xxs: 4,
  xs: 8,
  sm: 12,
  base: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 48,
  section: 96,
}

// Common inline button style (pill shape, 44px height)
export const btn = {
  pill: {
    height: 44,
    borderRadius: rounded.pill,
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 20px',
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.15,
    boxSizing: 'border-box' as const,
  },
  primary: {
    background: '#0052ff',
    color: '#ffffff',
    border: 'none',
  },
  secondary: {
    background: 'transparent',
    color: '#0a0b0d',
    border: `1px solid #dee1e6`,
  },
  ghost: {
    background: 'transparent',
    color: '#0a0b0d',
    border: 'none',
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: rounded.pill as number,
    border: 'none',
    cursor: 'pointer' as const,
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    boxSizing: 'border-box' as const,
  },
}

// Common input style (pill shape, 44px height)
export const inputStyle: React.CSSProperties = {
  height: 44,
  borderRadius: rounded.pill,
  border: `1px solid ${colors.hairline}`,
  background: colors.surfaceSoft,
  fontSize: 14,
  outline: 'none',
  color: colors.ink,
  boxSizing: 'border-box',
  padding: '0 16px',
}