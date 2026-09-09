import { CartItem, OrderCustomerInfo, BusinessInfo } from '../types';

export function formatPrice(amount: number, currency: string = '$'): string {
  const formatted = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${currency} ${formatted}`;
}

export function cleanPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  let digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    // E.g. 1134501611 -> 5491134501611
    digits = `549${digits}`;
  } else if (digits.length === 11 && digits.startsWith('0')) {
    // E.g. 01134501611 -> 5491134501611
    digits = `549${digits.substring(1)}`;
  } else if (digits.length === 12 && digits.startsWith('54') && !digits.startsWith('549')) {
    // E.g. 541134501611 -> 5491134501611
    digits = `549${digits.substring(2)}`;
  }
  return digits;
}

export function generateWhatsAppOrderMessage(
  business: BusinessInfo,
  cartItems: CartItem[],
  customerInfo: OrderCustomerInfo,
  totalAmount: number
): string {
  const lines: string[] = [];

  lines.push(`👋 *¡Hola ${business.name}! Quiero realizar un pedido:*`);
  lines.push('');
  lines.push('📋 *DETALLE DEL PEDIDO:*');
  lines.push('─────────────────────────');

  cartItems.forEach((item, index) => {
    lines.push(`${index + 1}. *${item.quantity}x ${item.productName}* (${formatPrice(item.itemTotal, business.currency)})`);
    
    if (item.variantName) {
      lines.push(`   ▫️ *Opción:* ${item.variantName}`);
    }

    if (item.selectedModifiers && item.selectedModifiers.length > 0) {
      // Group modifiers by group name
      const grouped: { [group: string]: string[] } = {};
      item.selectedModifiers.forEach((mod) => {
        if (!grouped[mod.groupName]) grouped[mod.groupName] = [];
        const extraText = mod.price > 0 ? ` (+${formatPrice(mod.price * mod.quantity, business.currency)})` : '';
        const qtyText = mod.quantity > 1 ? `${mod.quantity}x ` : '';
        grouped[mod.groupName].push(`${qtyText}${mod.optionName}${extraText}`);
      });

      Object.entries(grouped).forEach(([groupName, opts]) => {
        lines.push(`   ▫️ _${groupName}:_ ${opts.join(', ')}`);
      });
    }

    if (item.customerNote && item.customerNote.trim()) {
      lines.push(`   ▫️ ✍️ _Nota:_ "${item.customerNote.trim()}"`);
    }

    lines.push('');
  });

  lines.push('─────────────────────────');
  lines.push(`💰 *TOTAL A PAGAR: ${formatPrice(totalAmount, business.currency)}*`);
  lines.push('─────────────────────────');
  lines.push('');
  lines.push('📍 *DATOS DEL CLIENTE:*');
  lines.push(`• *Nombre:* ${customerInfo.customerName}`);
  lines.push(`• *Modalidad:* ${customerInfo.orderType === 'delivery' ? '🛵 Envío a Domicilio' : '🏪 Retiro en el Local'}`);
  
  if (customerInfo.orderType === 'delivery' && customerInfo.address) {
    lines.push(`• *Dirección:* ${customerInfo.address}`);
  }

  const paymentLabels: Record<string, string> = {
    efectivo: '💵 Efectivo al recibir',
    transferencia: '💳 Transferencia / Mercado Pago',
    tarjeta: '💳 Tarjeta de débito/crédito',
    otro: 'Acordar con el local',
  };
  lines.push(`• *Forma de pago:* ${paymentLabels[customerInfo.paymentMethod] || customerInfo.paymentMethod}`);

  if (customerInfo.notes && customerInfo.notes.trim()) {
    lines.push(`• *Aclaraciones:* ${customerInfo.notes.trim()}`);
  }

  lines.push('');
  lines.push('🙏 _Por favor confirmar recepción del pedido y tiempo estimado de entrega. ¡Muchas gracias!_');

  return lines.join('\n');
}

export function getWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = cleanPhoneNumber(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
