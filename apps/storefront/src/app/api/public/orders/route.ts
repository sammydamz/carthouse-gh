import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `CH-${timestamp}-${random}`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      shippingCity,
      shippingRegion,
      shippingNotes,
      paymentMethod,
      items,
      totalAmount,
    } = body
    
    if (!customerName || !customerPhone || !shippingAddress || !items?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const paymentMethodEnum = paymentMethod === 'cod' ? 'COD' : 'PAYSTACK'
    
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName,
        customerPhone,
        customerRegion: shippingRegion || null,
        customerAddress: shippingAddress,
        deliveryInstructions: shippingNotes || null,
        paymentMethod: paymentMethodEnum as 'PAYSTACK' | 'COD',
        totalAmount,
        orderStatus: 'PENDING',
        paymentStatus: 'PENDING',
        items: {
          create: items.map((item: {
            productId: string
            quantity: number
            price: number
            variant: string | null
          }) => ({
            productId: item.productId,
            productName: '', 
            quantity: item.quantity,
            price: item.price,
            size: item.variant || null,
          })),
        },
      },
      include: {
        items: true,
      },
    })
    
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}