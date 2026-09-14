import React, { useState, useEffect } from 'react';
import { Category, Product } from '../../types';
import {
  X,
  ArrowUp,
  ArrowDown,
  ArrowUpToLine,
  ArrowDownToLine,
  Check,
  GripVertical,
  HelpCircle,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';

interface CategoryReorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  products: Product[];
  onSaveCategories: (updatedCategories: Category[]) => void;
}

export const CategoryReorderModal: React.FC<CategoryReorderModalProps> = ({
  isOpen,
  onClose,
  categories,
  products,
  onSaveCategories,
}) => {
  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  useEffect(() => {
    // Sort copy by order
    const sorted = [...categories].sort((a, b) => (a.order || 0) - (b.order || 0));
    setLocalCategories(sorted);
    setHasUnsavedChanges(false);
  }, [categories, isOpen]);

  if (!isOpen) return null;

  const handleMove = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= localCategories.length || fromIndex === toIndex) {
      return;
    }

    const updated = [...localCategories];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);

    // Re-assign order numbers 1, 2, 3...
    const withNewOrder = updated.map((cat, idx) => ({
      ...cat,
      order: idx + 1,
    }));

    setLocalCategories(withNewOrder);
    setHasUnsavedChanges(true);
  };

  const handleMoveToTop = (index: number) => {
    handleMove(index, 0);
  };

  const handleMoveToBottom = (index: number) => {
    handleMove(index, localCategories.length - 1);
  };

  const handleJumpToPosition = (fromIndex: number, newPositionOneBased: number) => {
    if (isNaN(newPositionOneBased)) return;
    const targetIndex = Math.max(0, Math.min(localCategories.length - 1, newPositionOneBased - 1));
    handleMove(fromIndex, targetIndex);
  };

  const handleSave = () => {
    const finalCategories = localCategories.map((cat, idx) => ({
      ...cat,
      order: idx + 1,
    }));

    onSaveCategories(finalCategories);
    setHasUnsavedChanges(false);
    setShowSuccessToast(true);

    setTimeout(() => {
      setShowSuccessToast(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 bg-neutral-950/80 flex items-center justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-amber-500 font-black text-sm">↕ ORDEN DE CATEGORÍAS</span>
              {hasUnsavedChanges && (
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold animate-pulse">
                  Cambios sin guardar
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
              Organizar el orden de las categorías
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

        {/* Explanation Helper Banner */}
        <div className="px-4 py-2.5 bg-amber-950/20 border-b border-amber-900/30 text-xs text-amber-300/90 shrink-0">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              La categoría <strong className="text-amber-200">#1</strong> será la primera que verán tus clientes al entrar al menú. El botón <strong>"Todos los platos"</strong> aparece al final de la barra.
            </span>
          </div>
        </div>

        {/* Categories List (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
          {localCategories.map((category, index) => {
            const isFirst = index === 0;
            const isLast = index === localCategories.length - 1;
            const positionNumber = index + 1;
            const productCount = products.filter((p) =>
              p.categoryIds && p.categoryIds.includes(category.id)
            ).length;

            return (
              <div
                key={category.id}
                className={`p-3 rounded-xl border transition-colors flex items-center justify-between gap-2 sm:gap-3 ${
                  isFirst
                    ? 'bg-amber-950/25 border-amber-500/40'
                    : 'bg-neutral-950/60 border-neutral-800/80 hover:bg-neutral-800/40'
                }`}
              >
                {/* Position Badge & Name & Product Count */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                      isFirst
                        ? 'bg-amber-500 text-neutral-950 shadow-sm'
                        : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                    }`}
                    title={`Posición: #${positionNumber}`}
                  >
                    #{positionNumber}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white truncate">
                        {category.name}
                      </h4>
                      {isFirst && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold hidden xs:inline-block">
                          Primera categoría
                        </span>
                      )}
                      {category.isFeatured && (
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" title="Destacada" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                      <span>{productCount} plato{productCount !== 1 ? 's' : ''}</span>
                      {category.isVisible === false && (
                        <span className="text-amber-500 text-[10px] font-semibold bg-amber-950/40 border border-amber-800/50 px-1.5 py-0.2 rounded">
                          Oculta
                        </span>
                      )}
                    </div>
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
                      max={localCategories.length}
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
          })}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {showSuccessToast && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                ¡Orden de categorías guardado!
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
