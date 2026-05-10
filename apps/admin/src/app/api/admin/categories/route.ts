import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { bustCategories } from '@/lib/cache'

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { children: { include: { _count: { select: { products: true } } } }, _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(categories)
}

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const data = await request.json()
    if (!data.name || !data.slug) {
      return NextResponse.json({ error: 'Missing required fields: name, slug' }, { status: 400 })
    }
    const category = await prisma.category.create({
      data: { name: data.name, slug: data.slug, imageUrl: data.imageUrl || null, parentId: data.parentId || null },
    })
    bustCategories()
    return NextResponse.json(category)
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}