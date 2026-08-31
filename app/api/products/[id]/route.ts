import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const dataToUpdate: any = {};

    if (body.slug !== undefined) dataToUpdate.slug = body.slug;
    if (body.nameAr !== undefined) dataToUpdate.nameAr = body.nameAr;
    if (body.nameFr !== undefined) dataToUpdate.nameFr = body.nameFr;
    if (body.descAr !== undefined) dataToUpdate.descAr = body.descAr;
    if (body.descFr !== undefined) dataToUpdate.descFr = body.descFr;
    if (body.price !== undefined) dataToUpdate.price = Number(body.price);
    if (body.image !== undefined) dataToUpdate.image = body.image;
    if (body.available !== undefined) dataToUpdate.available = Boolean(body.available);
    if (body.featured !== undefined) dataToUpdate.featured = Boolean(body.featured);

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: dataToUpdate,
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Delete any order items referring to this product first to avoid FK constraint errors
    await prisma.orderItem.deleteMany({
      where: { productId: params.id },
    });

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
