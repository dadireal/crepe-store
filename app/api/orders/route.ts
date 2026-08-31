import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { appendOrderToSheet } from '@/lib/sheets';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, customerAddress, deliveryMethod, paymentMethod, note, items } = body;

    if (!customerName || !customerPhone || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const productIds = items.map((i: any) => i.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    let total = 0;
    const orderItemsData: Array<{ productId: string; quantity: number; price: number }> = [];
    const waItems: Array<{ name: string; quantity: number; price: number }> = [];

    for (const item of items) {
      const dbProduct = productMap.get(item.id);
      if (!dbProduct) continue;

      const itemTotal = dbProduct.price * item.quantity;
      total += itemTotal;

      orderItemsData.push({
        productId: dbProduct.id,
        quantity: item.quantity,
        price: dbProduct.price,
      });

      waItems.push({
        name: dbProduct.nameAr,
        quantity: item.quantity,
        price: dbProduct.price,
      });
    }

    const order = await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        customerAddress,
        deliveryMethod,
        paymentMethod,
        note,
        total,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    const whatsappUrl = buildWhatsAppUrl({
      id: order.id,
      customerName,
      customerPhone,
      customerAddress,
      deliveryMethod,
      paymentMethod,
      items: waItems,
      total,
      note,
    });

    appendOrderToSheet({
      id: order.id,
      customerName,
      customerPhone,
      customerAddress,
      deliveryMethod,
      paymentMethod,
      total,
      itemsSummary: waItems.map((i) => i.name + " x" + i.quantity).join(', '),
      note,
      createdAt: order.createdAt,
    }).catch((err) => console.error('[Google Sheets Background Error]', err));

    return NextResponse.json({
      success: true,
      orderId: order.id,
      whatsappUrl,
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}