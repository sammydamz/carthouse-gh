import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getProductDetailCache } from '@/lib/cache'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const cache = getProductDetailCache()
    const cached = cache.get(slug)
    if (cached) {
      return NextResponse.json(cached)
    }

    const product = await prisma.product.findUnique({
      where: { slug, isDeleted: false },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        supplier: { select: { id: true, name: true } },
        variants: {
          select: { id: true, variantId: true, size: true, color: true, stock: true },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    cache.set(slug, product)

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}