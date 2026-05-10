import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  const suppliers = await prisma.supplier.findMany({
    include: { _count: { select: { products: true, orderItems: true } } },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(suppliers)
}

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const data = await request.json()
    if (!data.name || !data.phone) {
      return NextResponse.json({ error: 'Missing required fields: name, phone' }, { status: 400 })
    }
    const supplier = await prisma.supplier.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        address: data.address || null,
        deliveryZones: data.deliveryZones || [],
        deliveryFee: data.deliveryFee ? parseFloat(data.deliveryFee) : null,
        notes: data.notes || null,
      },
    })
    return NextResponse.json(supplier)
  } catch (error) {
    console.error('Error creating supplier:', error)
    return NextResponse.json({ error: 'Failed to create supplier' }, { status: 500 })
  }
}