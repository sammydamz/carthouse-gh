import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCategoriesCache } from '@/lib/cache'

export async function GET() {
  try {
    const cache = getCategoriesCache()
    const cached = cache.get('all')
    if (cached) {
      return NextResponse.json(cached)
    }

    const categories = await prisma.category.findMany({
      include: {
        children: true,
        parent: true,
      },
      orderBy: { name: 'asc' },
    })

    cache.set('all', categories)

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}