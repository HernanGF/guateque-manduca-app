import React, { useState, useMemo } from 'react';
import { Product, ModifierGroup, ProductVariant, SelectedModifier, Category } from '../types';
import { formatPrice } from '../utils/formatters';
import { X, Plus, Minus, Check, AlertCircle, Sparkles } from 'lucide-react';
import { ProductDescription, isCateringProduct } from './ProductDescription';

interface ProductCustomizerModalProps {
  product: Product;
  categories?: Category[];
  modifierGroups: ModifierGroup[];
  currency: string;
  onClose: () => void;
  onAddToCart: (customizedItem: {
    productId: string;
    productName: string;
    productImage: string;
    variantId?: string;
    variantName?: string;
    unitPrice: number;
    selectedModifiers: SelectedModifier[];
    quantity: number;
    itemTotal: number;
    customerNote?: string;
  }) => void;
}

export const ProductCustomizerModal: React.FC<ProductCustomizerModalProps> = ({
  product,
  categories,
  modifierGroups,
  currency,
  onClose,
  onAddToCart,
}) => {
  // Available modifier groups for this product
  const attachedGroups = useMemo(() => {
    const rawIds = product.modifierGroupIds || [];
    return rawIds
      .map((id) =>
        modifierGroups.find(
          (g) =>
            g.id === id ||
            g.name.trim().toLowerCase() === id.trim().toLowerCase()
        )
      )
      .filter((g): g is ModifierGroup => !!g);
  }, [product.modifierGroupIds, modifierGroups]);

  // Selected variant
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(() => {
    if (product.priceType === 'variants' && product.variants.length > 0) {
      return product.variants.find((v) => v.isVisible !== false) || product.variants[0];
    }
    return null;
  });

  // State for modifiers: map of groupId -> map of optionId -> quantity
  const [modifierSelections, setModifierSelections] = useState<{
    [groupId: string]: { [optionId: string]: number };
  }>(() => {
    const initial: { [groupId: string]: { [optionId: string]: number } } = {};
    attachedGroups.forEach((group) => {
      initial[group.id] = {};
    });
    return initial;
  });

  const [quantity, setQuantity] = useState(1);
  const [customerNote, setCustomerNote] = useState('');
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // Calculate Base Unit Price
  const basePrice = useMemo(() => {
    if (product.priceType === 'variants') {
      return selectedVariant ? selectedVariant.price : 0;
    }
    return product.simplePrice || 0;
  }, [product, selectedVariant]);

  // Calculate Extra Modifiers Price per unit
  const modifiersPricePerUnit = useMemo(() => {
    let sum = 0;
    attachedGroups.forEach((group) => {
      const groupSelections = modifierSelections[group.id] || {};
      group.options.forEach((opt) => {
        const count = groupSelections[opt.id] || 0;
        if (count > 0 && opt.price) {
          sum += opt.price * count;
        }
      });
    });
    return sum;
  }, [attachedGroups, modifierSelections]);

  const unitTotal = basePrice + modifiersPricePerUnit;
  const grandTotal = unitTotal * quantity;

  // Validation: Check if all required groups are satisfied
  const validationErrors = useMemo(() => {
    const errors: { [groupId: string]: string } = {};

    if (product.priceType === 'variants' && !selectedVariant) {
      errors['variant'] = 'Debes seleccionar una opción o variante.';
    }

    attachedGroups.forEach((group) => {
      const groupSelections = modifierSelections[group.id] || {};
      const totalCountInGroup = (Object.values(groupSelections) as number[]).reduce(
        (acc: number, curr: number) => acc + curr,
        0
      );

      if (group.condition === 'required') {
        const min = group.minSelect || 1;
        if (totalCountInGroup < min) {
          errors[group.id] = `Selección obligatoria (mínimo ${min}).`;
        }
      }

      if (group.maxSelect && totalCountInGroup > group.maxSelect) {
        errors[group.id] = `Has superado el máximo permitido (${group.maxSelect}).`;
      }
    });

    return errors;
  }, [attachedGroups, modifierSelections, product, selectedVariant]);

  const isValid = Object.keys(validationErrors).length === 0;

  // Handlers for modifier selection
  const handleSingleSelect = (groupId: string, optionId: string) => {
    setModifierSelections((prev) => ({
      ...prev,
      [groupId]: { [optionId]: 1 },
    }));
  };

  const handleMultipleToggle = (groupId: string, optionId: string, maxSelect?: number) => {
    setModifierSelections((prev) => {
      const currentGroup = prev[groupId] || {};
      const currentCount = currentGroup[optionId] || 0;
      const totalInGroup = (Object.values(currentGroup) as number[]).reduce(
        (acc: number, curr: number) => acc + curr,
        0
      );

      // If already checked, uncheck
      if (currentCount > 0) {
        const next = { ...currentGroup };
        delete next[optionId];
        return { ...prev, [groupId]: next };
      }

      // If trying to check and max reached, do nothing or block
      if (maxSelect && totalInGroup >= maxSelect) {
        return prev;
      }

      return {
        ...prev,
        [groupId]: { ...currentGroup, [optionId]: 1 },
      };
    });
  };

  const handleSubmit = () => {
    if (!isValid) {
      setShowValidationErrors(true);
      return;
    }

    // Build flattened selected modifiers list
    const selectedMods: SelectedModifier[] = [];
    attachedGroups.forEach((group) => {
      const groupSelections = modifierSelections[group.id] || {};
      group.options.forEach((opt) => {
        const count = groupSelections[opt.id] || 0;
        if (count > 0) {
          selectedMods.push({
            groupId: group.id,
            groupName: group.name,
            optionId: opt.id,
            optionName: opt.name,
            price: opt.price || 0,
            quantity: count,
          });
        }
      });
    });

    onAddToCart({
      productId: product.id,
      productName: product.name,
      productImage: product.imageUrl,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      unitPrice: unitTotal,
      selectedModifiers: selectedMods,
      quantity,
      itemTotal: grandTotal,
      customerNote: customerNote.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden text-neutral-900 my-auto">
        
        {/* Product Image Header */}
        <div className="relative h-52 sm:h-60 w-full bg-neutral-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/30" />

          {/* Close button */}
          <button
            id="btn-close-modal"
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-transform hover:scale-105 cursor-pointer z-10"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge if featured */}
          {product.isFeatured && (
            <div className="absolute top-3 left-3 bg-amber-500 text-neutral-950 font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              Destacado
            </div>
          )}
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 max-h-[68vh] overflow-y-auto space-y-6">
          {/* Header titles */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mb-2 leading-tight tracking-tight">{product.name}</h2>
            <ProductDescription
              description={product.description}
              isCatering={isCateringProduct(product, categories)}
              mode="modal"
            />

            {/* Quick summary chips of available customizations */}
            {attachedGroups.length > 0 && (
              <div className="mt-3.5 flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm text-amber-700 font-bold flex items-center gap-1.5 mr-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Opciones disponibles:
                </span>
                {attachedGroups.map((g) => (
                  <span
                    key={g.id}
                    className="text-xs sm:text-sm px-2.5 py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-700 font-semibold"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Variant Selection if type is 'variants' */}
          {product.priceType === 'variants' && product.variants.length > 0 && (
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-700 font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <span className="text-base sm:text-lg font-bold text-neutral-900">Selecciona tu porción</span>
                </div>
                <span className="text-xs sm:text-sm text-amber-700 font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                  Obligatorio
                </span>
              </div>

              {product.clientNote && (
                <p className="text-xs sm:text-sm text-amber-900 italic mb-3 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                  ℹ️ {product.clientNote}
                </p>
              )}

              <div className="space-y-2">
                {product.variants
                  .filter((v) => v.isVisible !== false)
                  .map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    return (
                      <label
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50 border-amber-500 text-neutral-900 shadow-xs'
                            : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-amber-500 bg-amber-500' : 'border-neutral-300'
                            }`}
                          >
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <span className="text-base font-semibold">{variant.name}</span>
                        </div>
                        <span className="text-base sm:text-lg font-black text-amber-600">
                          {formatPrice(variant.price, currency)}
                        </span>
                      </label>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Modifier Groups */}
          {attachedGroups.map((group, gIdx) => {
            const isRequired = group.condition === 'required';
            const isSingle = group.selectionType === 'single';
            const groupSelections = modifierSelections[group.id] || {};
            const totalSelected = (Object.values(groupSelections) as number[]).reduce(
              (a: number, b: number) => a + b,
              0
            );
            const error = showValidationErrors && validationErrors[group.id];
            const stepNumber = product.priceType === 'variants' && product.variants.length > 0 ? gIdx + 2 : gIdx + 1;

            return (
              <div
                key={group.id}
                className={`bg-neutral-50 rounded-xl p-4 border transition-colors ${
                  error ? 'border-red-400 bg-red-50/50' : 'border-neutral-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                      {stepNumber}
                    </span>
                    <span className="text-base sm:text-lg font-bold text-neutral-900">{group.name}</span>
                    <span
                      className={`text-xs sm:text-sm font-semibold px-2.5 py-0.5 rounded-full ${
                        isRequired
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {isRequired ? 'Obligatorio' : 'Opcional'}
                    </span>
                  </div>

                  <span className="text-xs sm:text-sm text-neutral-500 font-medium">
                    {isSingle
                      ? 'Elige 1'
                      : group.maxSelect
                      ? `Hasta ${group.maxSelect} (Llevas ${totalSelected})`
                      : 'Múltiple'}
                  </span>
                </div>

                {error && (
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-red-600 mt-1 mb-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-2 mt-3">
                  {group.options
                    .filter((opt) => opt.isVisible !== false)
                    .map((opt) => {
                      const isSelected = (groupSelections[opt.id] || 0) > 0;
                      const isMaxReached =
                        !isSingle &&
                        !!group.maxSelect &&
                        totalSelected >= group.maxSelect &&
                        !isSelected;

                      return (
                        <div
                          key={opt.id}
                          onClick={() => {
                            if (isSingle) {
                              handleSingleSelect(group.id, opt.id);
                            } else {
                              handleMultipleToggle(group.id, opt.id, group.maxSelect);
                            }
                          }}
                          className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                            isSelected
                              ? 'bg-amber-50 border-amber-500 text-neutral-900 shadow-xs'
                              : isMaxReached
                              ? 'bg-neutral-100/60 border-neutral-200 opacity-50 cursor-not-allowed text-neutral-400'
                              : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-${isSingle ? 'full' : 'md'} border flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'border-amber-500 bg-amber-500 text-neutral-950'
                                  : 'border-neutral-300'
                              }`}
                            >
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              )}
                            </div>
                            <span className="text-base font-semibold">{opt.name}</span>
                          </div>

                          <span className="text-sm sm:text-base font-bold text-neutral-800">
                            {opt.price && opt.price > 0
                              ? `+ ${formatPrice(opt.price, currency)}`
                              : 'Incluido'}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}

          {/* Customer Specific Instructions */}
          <div>
            <label className="block text-sm sm:text-base font-bold text-neutral-800 mb-2">
              Nota
            </label>
            <textarea
              rows={2}
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              placeholder="Nota o aclaraciones..."
              className="w-full px-3.5 py-2.5 text-base bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-amber-500 focus:bg-white resize-none"
            />
          </div>
        </div>

        {/* Modal Bottom Sticky Bar */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between gap-3">
          {/* Quantity Controls */}
          <div className="flex items-center bg-white border border-neutral-200 rounded-xl p-1 shrink-0">
            <button
              id="btn-qty-minus"
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-9 text-center text-base font-black text-neutral-900">{quantity}</span>
            <button
              id="btn-qty-plus"
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-neutral-700 hover:bg-neutral-100 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            id="btn-confirm-add-to-cart"
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-3.5 px-4 bg-amber-500 hover:bg-amber-400 active:scale-98 text-neutral-950 font-black text-base rounded-xl shadow-lg transition-all flex items-center justify-between cursor-pointer"
          >
            <span>Agregar al Pedido</span>
            <span>{formatPrice(grandTotal, currency)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
