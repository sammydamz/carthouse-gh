// Force all admin routes to be dynamic (no caching)
// This ensures data always reflects latest DB state
export const dynamic = 'force-dynamic'

export default function RoutesLayout({ children }: { children: React.ReactNode }) {
   return children
}
