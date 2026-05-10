import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { bustAll } from '@/lib/cache'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        supplier: true,
        variants: true,
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const data = await request.json()

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        price: data.price,
        condition: data.condition || null,
        stock: data.stock,
        isAvailable: data.isAvailable,
        media: data.media || [],
        videoUrl: data.videoUrl || null,
        categoryId: data.categoryId || null,
        supplierId: data.supplierId || null,
      },
    })

    if (data.variants) {
      await prisma.productVariant.deleteMany({ where: { productId: id } })
      if (data.variants.length > 0) {
        await prisma.productVariant.createMany({
          data: data.variants.map((v: { size: string; color: string; stock: number }) => ({
            productId: id,
            variantId: `${id}-${v.size}-${v.color}`,
            size: v.size,
            color: v.color,
            stock: v.stock,
          })),
        })
      }
    }

    bustAll()

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params

    await prisma.product.update({
      where: { id },
      data: { isDeleted: true },
    })

    bustAll()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}