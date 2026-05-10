import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { bustAll } from '@/lib/cache'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, supplier: true, variants: true },
  })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const data = await request.json()

    await prisma.productVariant.deleteMany({ where: { productId: id } })

    const product = await prisma.product.update({
      where: { id },
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
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    await prisma.product.update({ where: { id }, data: { isDeleted: true } })
    bustAll()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}