import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(order)
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()

    const updateData: Record<string, any> = {}
    if (data.orderStatus) updateData.orderStatus = data.orderStatus
    if (data.paymentStatus) updateData.paymentStatus = data.paymentStatus

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true },
    })
    return NextResponse.json(order)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}