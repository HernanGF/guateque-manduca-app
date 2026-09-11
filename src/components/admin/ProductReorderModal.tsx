import React, { useState, useEffect } from 'react';
import { Product, Category } from '../../types';
import { getProductOrder, sortProductsByOrder, reorderProductsForCategory } from '../../utils/productOrder';
import { formatPrice } from '../../utils/formatters';
import {
  X,
  ArrowUp,
  ArrowDown,
  ArrowUpToLine,
  ArrowDownToLine,
  Check,
  Sparkles,
  GripVertical,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

interface ProductReorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  products: Product[];
  initialCategoryId?: string;
  currency: string;
  onSaveProducts: (updatedProducts: Product[]) => void;
}

export const ProductReorderModal: React.FC<ProductReorderModalProps> = ({
  isOpen,
  onClose,
  categories,
  products,
  initialCategoryId,
  currency,
  onSaveProducts,
}) => {
  // Determine starting category (default to first category or initialCategoryId if valid)
  const defaultCatId =
    initialCategoryId && initialCategoryId !== 'all'
      ? initialCategoryId
      : categories[0]?.id || 'cat_los-mas-elegidos';

  const [activeCategoryId, setActiveCategoryId] = useState<string>(defaultCatId);
  const [localCategoryProducts, setLocalCategoryProducts] = useState<Product[]>([]);
  const [allProductsState, setAllProductsState] = useState<Product[]>(products);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  // Sync products when modal opens or products prop changes
  useEffect(() => {
    setAllProductsState(products);
  }, [products]);

  // When activeCategoryId changes, load sorted products for that category
  useEffect(() => {
    const catProducts = allProductsState.filter((p) => {
      if (activeCategoryId === 'cat_los-mas-elegidos') {
        return p.isFeatured || (p.categoryIds && p.categoryIds.includes('cat_los-mas-elegidos'));
      }
      return p.categoryIds && p.categoryIds.includes(activeCategoryId);
    });

    const sorted = sortProductsByOrder(catProducts, activeCategoryId);
    setLocalCategoryProducts(sorted);
  }, [activeCategoryId, allProductsState]);

  if (!isOpen) return null;

  const currentCategory = categories.find((c) => c.id === activeCategoryId);

  // Move an item within localCategoryProducts
  const handleMove = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= localCategoryProducts.length || fromIndex === toIndex) {
      return;
    }

    const updated = [...localCategoryProducts];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);

    setLocalCategoryProducts(updated);
    setHasUnsavedChanges(true);

    // Update the master products array
    const orderedIds = updated.map((p) => p.id);
    const newAllProducts = reorderProductsForCategory(
      allProductsState,
      activeCategoryId,
      orderedIds
    );
    setAllProductsState(newAllProducts);
  };

  // Move to #1 spot
  const handleMoveToTop = (index: number) => {
    handleMove(index, 0);
  };

  // Move to bottom spot
  const handleMoveToBottom = (index: number) => {
    handleMove(index, localCategoryProducts.length - 1);
  };

  // Jump to specific 1-based number
  const handleJumpToPosition = (fromIndex: number, newPositionOneBased: number) => {
    if (isNaN(newPositionOneBased)) return;
    const targetIndex = Math.max(0, Math.min(localCategoryProducts.length - 1, newPositionOneBased - 1));
    handleMove(fromIndex, targetIndex);
  };

  // Save all changes
  const handleSave = () => {
    // Commit the current order of the active category to allProductsState
    const orderedIds = localCategoryProducts.map((p) => p.id);
    const updatedProducts = reorderProductsForCategory(
      allProductsState,
      activeCategoryId,
      orderedIds
    );

    onSaveProducts(updatedProducts);
    setAllProductsState(updatedProducts);
    setHasUnsavedChanges(false);
    setShowSuccessToast(true);

    setTimeout(() => {
      setShowSuccessToast(false);
    }, 2500);
  };

  // Save and close
  const handleSaveAndClose = () => {
    handleSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 bg-neutral-950/80 flex items-center justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-amber-500 font-black text-sm">↕ ORDEN DE PRODUCTOS</span>
              {hasUnsavedChanges && (
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold animate-pulse">
                  Cambios sin guardar
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
              Personalizar qué productos van primero
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Selector Tabs */}
        <div className="p-3 bg-neutral-950/50 border-b border-neutral-800 shrink-0">
          <label className="text-xs font-medium text-neutral-400 mb-1.5 block">
            Selecciona la categoría que quieres ordenar:
          </label>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => {
              const count = allProductsState.filter((p) => {
                if (cat.id === 'cat_los-mas-elegidos') {
                  return p.isFeatured || (p.categoryIds && p.categoryIds.includes('cat_los-mas-elegidos'));
                }
                return p.categoryIds && p.categoryIds.includes(cat.id);
              }).length;

              const isSelected = activeCategoryId === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (hasUnsavedChanges) {
                      handleSave();
                    }
                    setActiveCategoryId(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-neutral-950 shadow-md font-bold'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-black/20 text-neutral-950 font-bold' : 'bg-neutral-900 text-neutral-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation Helper Banner */}
        <div className="px-4 py-2 bg-amber-950/20 border-b border-amber-900/30 flex items-center justify-between text-xs text-amber-300/90 shrink-0">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Usa los botones <strong className="text-amber-200">🔝 1°</strong> para subir tu plato favorito al primer puesto o las flechas para acomodarlo.
            </span>
          </div>
        </div>

        {/* Products List (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 divide-y divide-neutral-800/40">
          {localCategoryProducts.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 flex flex-col items-center gap-2">
              <AlertCircle className="w-8 h-8 text-neutral-600" />
              <p className="text-sm">No hay productos en esta categoría.</p>
            </div>
          ) : (
            localCategoryProducts.map((product, index) => {
              const isFirst = index === 0;
              const isLast = index === localCategoryProducts.length - 1;
              const positionNumber = index + 1;

              return (
                <div
                  key={product.id}
                  className={`pt-2 first:pt-0 flex items-center justify-between gap-2 sm:gap-3 p-2 rounded-xl transition-colors ${
                    isFirst
                      ? 'bg-amber-950/25 border border-amber-600/30'
                      : 'hover:bg-neutral-800/50'
                  }`}
                >
                  {/* Position Badge & Thumbnail & Info */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {/* Position Badge */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                        isFirst
                          ? 'bg-amber-500 text-neutral-950 shadow-sm'
                          : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                      }`}
                      title={`Posición actual: #${positionNumber}`}
                    >
                      #{positionNumber}
                    </div>

                    {/* Image */}
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-white truncate">
                          {product.name}
                        </h4>
                        {product.isFeatured && (
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                        {isFirst && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold hidden xs:inline-block">
                            1° Lugar
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 font-medium mt-0.5">
                        {product.priceType === 'variants'
                          ? 'Variantes'
                          : formatPrice(product.simplePrice, currency)}
                      </p>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                    {/* Direct position number input */}
                    <div className="hidden sm:flex items-center gap-1 bg-neutral-950 border border-neutral-800 rounded-lg px-1.5 py-1" title="Escribe el número de posición directa">
                      <span className="text-[11px] text-neutral-500 font-mono">Pos:</span>
                      <input
                        type="number"
                        min="1"
                        max={localCategoryProducts.length}
                        value={positionNumber}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val)) {
                            handleJumpToPosition(index, val);
                          }
                        }}
                        className="w-8 bg-transparent text-center text-xs font-bold text-amber-400 focus:outline-none focus:bg-neutral-900 rounded"
                      />
                    </div>

                    {/* Poner 1° Button */}
                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={() => handleMoveToTop(index)}
                      className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                        isFirst
                          ? 'opacity-30 cursor-not-allowed text-neutral-600 bg-neutral-900'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-neutral-950'
                      }`}
                      title="Mover al 1° lugar de inmediato"
                    >
                      <ArrowUpToLine className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">1°</span>
                    </button>

                    {/* Subir una posición */}
                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={() => handleMove(index, index - 1)}
                      className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                        isFirst
                          ? 'opacity-30 cursor-not-allowed border-neutral-800 text-neutral-600 bg-neutral-950'
                          : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-700'
                      }`}
                      title="Subir una posición"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    {/* Bajar una posición */}
                    <button
                      type="button"
                      disabled={isLast}
                      onClick={() => handleMove(index, index + 1)}
                      className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                        isLast
                          ? 'opacity-30 cursor-not-allowed border-neutral-800 text-neutral-600 bg-neutral-950'
                          : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-700'
                      }`}
                      title="Bajar una posición"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    {/* Mandar al final */}
                    <button
                      type="button"
                      disabled={isLast}
                      onClick={() => handleMoveToBottom(index)}
                      className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                        isLast
                          ? 'opacity-30 cursor-not-allowed border-neutral-800 text-neutral-600 bg-neutral-950'
                          : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-700'
                      }`}
                      title="Mover al último lugar"
                    >
                      <ArrowDownToLine className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {showSuccessToast && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                ¡Orden guardado con éxito!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Cerrar
            </button>

            <button
              type="button"
              onClick={handleSave}
              className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                hasUnsavedChanges
                  ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-lg shadow-amber-500/20 animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Guardar orden</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
