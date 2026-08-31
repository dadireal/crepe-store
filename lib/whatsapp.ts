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
  const rawPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '213550926271';
  const cleanPhone = rawPhone.replace(/\D/g, '');

  const itemsList = order.items
    .map((item) => `🥞 ${item.name} x${item.quantity} (${item.price * item.quantity} دج)`)
    .join('\n');

  const deliveryText = order.deliveryMethod === 'delivery' 
    ? `🛵 توصيل للمنزل (${order.customerAddress || 'عنوان العميل'})` 
    : '🏪 استلام من المحل';

  const paymentText = order.paymentMethod === 'baridimob' 
    ? '💳 بريدي موب (BaridiMob)' 
    : '💵 دفع نقداً (Main à main)';

  const shortId = order.id.slice(-6).toUpperCase();

  const message = `👋 مرحباً، طلب جديد (${shortId})

👤 العميل: ${order.customerName}
📱 الهاتف: ${order.customerPhone}
${deliveryText}
${paymentText}

📋 الطلبات:
${itemsList}

💰 المجموع: ${order.total} دج
${order.note ? `📝 ملاحظة: ${order.note}\n` : ''}يرجى تأكيد الطلب. شكراً!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}