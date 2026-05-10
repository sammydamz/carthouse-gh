import { CartProvider } from '@/lib/cart'
import { CartDrawer } from '@/components/CartDrawer'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>CartHouse GH - Premium Electronics in Ghana</title>
        <meta name="description" content="Your trusted destination for premium electronics and gadgets in Ghana" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}