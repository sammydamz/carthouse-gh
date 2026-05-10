import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { bustCategories } from '@/lib/cache'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = await prisma.category.findUnique({
    where: { id },
    include: { children: { include: { _count: { select: { products: true } } } }, parent: true, products: { take: 10 }, _count: { select: { products: true } } },
  })
  if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(category)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const data = await request.json()
    const category = await prisma.category.update({
      where: { id },
      data: { name: data.name, slug: data.slug, imageUrl: data.imageUrl || null, parentId: data.parentId || null },
    })
    bustCategories()
    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    await prisma.category.delete({ where: { id } })
    bustCategories()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}