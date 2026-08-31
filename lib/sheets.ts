// Lightweight Google Sheets integration helper
// Supports either Google Apps Script Webhook URL (easiest & fastest) or REST API endpoint

export async function appendOrderToSheet(order: {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string | null;
  deliveryMethod: string;
  paymentMethod: string;
  total: number;
  itemsSummary: string;
  note?: string | null;
  createdAt: Date;
}) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log('[Google Sheets] No GOOGLE_SHEETS_WEBHOOK_URL configured yet. Order logged locally.');
    return true;
  }

  try {
    const payload = {
      orderId: order.id,
      date: order.createdAt.toISOString(),
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      deliveryMethod: order.deliveryMethod,
      customerAddress: order.customerAddress || 'N/A',
      paymentMethod: order.paymentMethod,
      items: order.itemsSummary,
      total: order.total,
      note: order.note || '',
      status: 'Pending',
    };

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.warn('[Google Sheets] Webhook responded with status:', res.status);
    }
    return true;
  } catch (error) {
    console.error('[Google Sheets Error]:', error);
    return false;
  }
}