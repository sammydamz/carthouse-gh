import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(orders)
}

export async function POST(request: Request) {
  // Orders are created via the public API (from storefront checkout)
  // This endpoint is reserved for admin-created orders in the future
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}