export interface WhatsAppOrderDetails {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string | null;
  deliveryMethod: string;
  paymentMethod: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  note?: string | null;
}

export function buildWhatsAppUrl(order: WhatsAppOrderDetails): string {
  const rawPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '213553440229';
  const cleanPhone = rawPhone.replace(/\D/g, '');

  const itemsList = order.items
    .map((item) => `- ${item.name} x${item.quantity} (${item.price * item.quantity} دج)`)
    .join('\n');

  const deliveryText = order.deliveryMethod === 'delivery' 
    ? `*طريقة الاستلام:* توصيل للمنزل (${order.customerAddress || 'عنوان العميل'})` 
    : '*طريقة الاستلام:* استلام من المحل';

  const paymentText = order.paymentMethod === 'baridimob' 
    ? '*طريقة الدفع:* بريدي موب (BaridiMob)' 
    : '*طريقة الدفع:* دفع نقداً (Main à main)';

  const shortId = order.id.slice(-6).toUpperCase();

  const lines = [
    `*طلب جديد (${shortId})*`,
    '',
    `*الاسم:* ${order.customerName}`,
    `*الهاتف:* ${order.customerPhone}`,
    deliveryText,
    paymentText,
    '',
    '*الطلبات:*',
    itemsList,
    '',
    `*المجموع:* ${order.total} دج`,
  ];

  if (order.note && order.note.trim()) {
    lines.push(`*ملاحظة:* ${order.note}`);
  }

  lines.push('');
  lines.push('يرجى تأكيد الطلب. شكراً!');

  const message = lines.join('\n');

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
