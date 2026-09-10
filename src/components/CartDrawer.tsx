import React, { useState } from 'react';
import { CartItem, BusinessInfo, OrderCustomerInfo } from '../types';
import { formatPrice, generateWhatsAppOrderMessage, getWhatsAppUrl } from '../utils/formatters';
import { X, Trash2, Plus, Minus, Send, ShoppingBag, Bike, Store, AlertCircle, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  business: BusinessInfo;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  business,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [customerInfo, setCustomerInfo] = useState<OrderCustomerInfo>({
    customerName: '',
    orderType: business.deliveryAvailable ? 'delivery' : 'takeaway',
    address: '',
    paymentMethod: 'transferencia',
    notes: '',
  });

  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);

  const handleSendWhatsAppOrder = () => {
    if (!customerInfo.customerName.trim()) {
      setFormError('Por favor ingresa tu nombre y apellido.');
      return;
    }

    if (customerInfo.orderType === 'delivery' && !customerInfo.address.trim()) {
      setFormError('Por favor ingresa tu dirección para el envío.');
      return;
    }

    setFormError(null);

    const message = generateWhatsAppOrderMessage(
      business,
      cartItems,
      customerInfo,
      totalAmount
    );

    const whatsappUrl = getWhatsAppUrl(business.whatsappPhone, message);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 text-neutral-100 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-lg text-white">Tu Pedido</h2>
              <span className="text-xs bg-neutral-800 text-amber-400 font-semibold px-2 py-0.5 rounded-full">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items
              </span>
            </div>

            <div className="flex items-center gap-2">
              {cartItems.length > 0 && (
                <button
                  id="btn-clear-cart"
                  onClick={onClearCart}
                  className="text-xs text-neutral-400 hover:text-red-400 p-1.5 transition-colors"
                  title="Vaciar carrito"
                >
                  Vaciar
                </button>
              )}
              <button
                id="btn-close-cart"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center cursor-pointer"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-neutral-300">El carrito está vacío</h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Selecciona productos del menú para comenzar a armar tu pedido.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 text-xs font-semibold text-amber-400 hover:text-amber-300 underline"
                >
                  Continuar viendo el menú
                </button>
              </div>
            ) : (
              <>
                {/* List of items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-neutral-950/80 border border-neutral-800/80 rounded-xl p-3 flex gap-3"
                    >
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-16 h-16 rounded-lg object-cover bg-neutral-800 shrink-0"
                        referrerPolicy="no-referrer"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-base text-white truncate">
                            {item.productName}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {item.variantName && (
                          <div className="text-sm text-amber-400/90 font-medium mt-0.5">
                            {item.variantName}
                          </div>
                        )}

                        {item.selectedModifiers.length > 0 && (
                          <div className="text-[11px] text-neutral-400 mt-1 space-y-0.5">
                            {item.selectedModifiers.map((mod, i) => (
                              <div key={i} className="truncate">
                                • {mod.quantity > 1 ? `${mod.quantity}x ` : ''}
                                {mod.optionName}
                                {mod.price > 0 && ` (+${formatPrice(mod.price * mod.quantity, business.currency)})`}
                              </div>
                            ))}
                          </div>
                        )}

                        {item.customerNote && (
                          <div className="text-[11px] text-neutral-400 italic mt-1 bg-neutral-900 p-1.5 rounded">
                            "{item.customerNote}"
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-900">
                          {/* Quantity control */}
                          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-neutral-400 hover:text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-neutral-400 hover:text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-sm font-bold text-amber-400">
                            {formatPrice(item.itemTotal, business.currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Customer Details Form */}
                <div className="pt-3 border-t border-neutral-800 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Datos para el pedido
                  </h3>

                  {formError && (
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-300">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Customer Name */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Nombre y Apellido <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="input-customer-name"
                      type="text"
                      value={customerInfo.customerName}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, customerName: e.target.value })
                      }
                      placeholder="Tu nombre completo"
                      className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Order Type: Delivery vs Takeaway */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Modalidad de Entrega
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setCustomerInfo({ ...customerInfo, orderType: 'delivery' })
                        }
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                          customerInfo.orderType === 'delivery'
                            ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                        }`}
                      >
                        <Bike className="w-4 h-4" />
                        <span>Envío a Domicilio</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setCustomerInfo({ ...customerInfo, orderType: 'takeaway' })
                        }
                        className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                          customerInfo.orderType === 'takeaway'
                            ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                        }`}
                      >
                        <Store className="w-4 h-4" />
                        <span>Retiro en Local</span>
                      </button>
                    </div>
                  </div>

                  {/* Address if delivery */}
                  {customerInfo.orderType === 'delivery' && (
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Dirección de Entrega <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="input-delivery-address"
                        type="text"
                        value={customerInfo.address}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, address: e.target.value })
                        }
                        placeholder="Calle, número, piso, depto, timbre..."
                        className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  )}

                  {/* Payment Method */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Forma de Pago
                    </label>
                    <select
                      id="select-payment-method"
                      value={customerInfo.paymentMethod}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          paymentMethod: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="transferencia">Transferencia Bancaria / Mercado Pago</option>
                      <option value="efectivo">Efectivo al recibir / retirar</option>
                      <option value="tarjeta">Tarjeta de débito / crédito</option>
                      <option value="otro">Otro / Consultar</option>
                    </select>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Aclaraciones generales del pedido
                    </label>
                    <input
                      type="text"
                      value={customerInfo.notes}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, notes: e.target.value })
                      }
                      placeholder="Ej: Si no atienden tocar timbre 4B..."
                      className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer with WhatsApp send button */}
          {cartItems.length > 0 && (
            <div className="p-4 bg-neutral-950 border-t border-neutral-800 space-y-3">
              <div className="flex items-center justify-between text-base font-bold">
                <span className="text-neutral-300">Total a Pagar:</span>
                <span className="text-xl text-amber-400">
                  {formatPrice(totalAmount, business.currency)}
                </span>
              </div>

              <button
                id="btn-send-whatsapp"
                type="button"
                onClick={handleSendWhatsAppOrder}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Pedido por WhatsApp</span>
              </button>

              <p className="text-[11px] text-center text-neutral-500">
                Se abrirá WhatsApp para enviar el pedido directamente al número del local.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
