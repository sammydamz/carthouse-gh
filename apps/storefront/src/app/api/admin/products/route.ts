import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        supplier: true,
        variants: true,
        _count: { select: { orderItems: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const data = await request.json()

    if (!data.name || !data.slug || data.price === undefined) {
      return NextResponse.json({ error: 'Name, slug, and price are required' }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        price: data.price,
        condition: data.condition || null,
        stock: data.stock || 0,
        isAvailable: data.isAvailable ?? true,
        isDeleted: false,
        media: data.media || [],
        videoUrl: data.videoUrl || null,
        categoryId: data.categoryId || null,
        supplierId: data.supplierId || null,
      },
    })

    if (data.variants && data.variants.length > 0) {
      await prisma.productVariant.createMany({
        data: data.variants.map((v: { size: string; color: string; stock: number }) => ({
          productId: product.id,
          variantId: `${product.id}-${v.size}-${v.color}`,
          size: v.size,
          color: v.color,
          stock: v.stock,
        })),
      })
    }

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}