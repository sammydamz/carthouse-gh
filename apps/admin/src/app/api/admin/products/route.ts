import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { bustAll } from '@/lib/cache'

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isDeleted: false },
    include: { category: true, supplier: true, variants: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const data = await request.json()

    if (!data.name || !data.slug || data.price === undefined) {
      return NextResponse.json({ error: 'Missing required fields: name, slug, price' }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        price: parseFloat(data.price),
        condition: data.condition || null,
        stock: parseInt(data.stock) || 0,
        isAvailable: data.isAvailable ?? true,
        media: data.media || [],
        videoUrl: data.videoUrl || null,
        categoryId: data.categoryId || null,
        supplierId: data.supplierId || null,
        variants: data.variants?.length ? {
          create: data.variants.map((v: any) => ({
            variantId: `${data.slug}-${v.size || ''}-${v.color || ''}`,
            size: v.size || null,
            color: v.color || null,
            stock: parseInt(v.stock) || 0,
          })),
        } : undefined,
      },
      include: { category: true, supplier: true, variants: true },
    })

    bustAll()
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}