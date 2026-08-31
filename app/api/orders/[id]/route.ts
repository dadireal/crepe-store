import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const waItems = order.items.map((i) => ({
      name: i.product?.nameAr || i.product?.nameFr || 'كريب',
      quantity: i.quantity,
      price: i.price,
    }));

    const whatsappUrl = buildWhatsAppUrl({
      id: order.id,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerAddress: order.customerAddress,
      deliveryMethod: order.deliveryMethod,
      paymentMethod: order.paymentMethod,
      items: waItems,
      total: order.total,
      note: order.note || undefined,
    });

    return NextResponse.json({
      order,
      whatsappUrl,
    });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
