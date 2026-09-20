import React, { useState, useMemo } from 'react';
import { ModifierGroup, ModifierOption, Product } from '../../types';
import { X, Plus, Trash2, GripVertical, Eye, EyeOff, Search, Check, Utensils } from 'lucide-react';

interface ModifierGroupModalProps {
  group: ModifierGroup | null; // null if creating new
  products?: Product[];
  currency: string;
  onClose: () => void;
  onSave: (group: ModifierGroup, associatedProductIds?: string[]) => void;
  onDelete?: (groupId: string) => void;
}

export const ModifierGroupModal: React.FC<ModifierGroupModalProps> = ({
  group,
  products = [],
  currency,
  onClose,
  onSave,
  onDelete,
}) => {
  const isEditing = !!group;

  const [name, setName] = useState(group?.name || '');
  const [condition, setCondition] = useState<'required' | 'optional'>(
    group?.condition || 'optional'
  );
  const [selectionType, setSelectionType] = useState<'single' | 'multiple'>(
    group?.selectionType || 'single'
  );
  const [minSelect, setMinSelect] = useState<number>(group?.minSelect || 1);
  const [maxSelect, setMaxSelect] = useState<number>(group?.maxSelect || 3);
  const [options, setOptions] = useState<ModifierOption[]>(
    group?.options || [
      { id: 'opt_1', name: 'Opción 1', price: 0, isVisible: true },
      { id: 'opt_2', name: 'Opción 2', price: 0, isVisible: true },
    ]
  );

  // Associated products state
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(() => {
    if (!group) return [];
    return products
      .filter((p) => (p.modifierGroupIds || []).includes(group.id))
      .map((p) => p.id);
  });
  const [productSearch, setProductSearch] = useState('');

  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return products;
    const q = productSearch.toLowerCase();
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }, [products, productSearch]);

  const handleToggleProduct = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSelectAllProducts = () => {
    setSelectedProductIds(products.map((p) => p.id));
  };

  const handleDeselectAllProducts = () => {
    setSelectedProductIds([]);
  };

  const handleAddOption = () => {
    const newId = `opt_${Date.now()}`;
    setOptions((prev) => [
      ...prev,
      { id: newId, name: '', price: 0, isVisible: true },
    ]);
  };

  const handleUpdateOption = (
    id: string,
    field: keyof ModifierOption,
    value: string | number | boolean
  ) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, [field]: value } : opt))
    );
  };

  const handleRemoveOption = (id: string) => {
    setOptions((prev) => prev.filter((opt) => opt.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Por favor ingresa el nombre de la categoría de modificadores.');
      return;
    }

    const validOptions = options
      .map((opt) => ({
        ...opt,
        name: opt.name.trim(),
        price: Number(opt.price) || 0,
      }))
      .filter((opt) => opt.name.length > 0);

    if (validOptions.length === 0) {
      alert('Debes incluir al menos una opción válida.');
      return;
    }

    const savedGroup: ModifierGroup = {
      id: group?.id || `mod_${Date.now()}`,
      name: name.trim(),
      condition,
      selectionType,
      minSelect: selectionType === 'multiple' ? Number(minSelect) : 1,
      maxSelect: selectionType === 'multiple' ? Number(maxSelect) : 1,
      options: validOptions,
    };

    onSave(savedGroup, selectedProductIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden text-neutral-900 my-auto">
        
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <h2 className="font-bold text-lg text-neutral-900">
            {isEditing ? 'Editar modificadores' : 'Crear modificadores'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-700 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto space-y-5">
          
          {/* Group Name input */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Nombre de la categoría de modificadores *
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={150}
                placeholder="Ej: Guarniciones, Salsas incluidas, Extras..."
                required
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-blue-500 focus:bg-white pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-neutral-400">
                {name.length}/150
              </span>
            </div>
          </div>

          {/* Seleccionar la condición: Obligatorio vs Opcional */}
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            <label className="block text-xs font-semibold text-neutral-800 mb-2.5">
              Seleccionar la condición
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="condition"
                  checked={condition === 'required'}
                  onChange={() => setCondition('required')}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <span className="text-xs font-medium text-neutral-900">Obligatorio</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="condition"
                  checked={condition === 'optional'}
                  onChange={() => setCondition('optional')}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <span className="text-xs font-medium text-neutral-900">Opcional</span>
              </label>
            </div>
          </div>

          {/* En esta categoría se puede seleccionar: Sólo un modificador vs Varios */}
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
            <label className="block text-xs font-semibold text-neutral-800 mb-2">
              En esta categoría se puede seleccionar:
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="selectionType"
                  checked={selectionType === 'single'}
                  onChange={() => setSelectionType('single')}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <span className="text-xs font-medium text-neutral-900">Sólo un modificador</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="selectionType"
                  checked={selectionType === 'multiple'}
                  onChange={() => setSelectionType('multiple')}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <span className="text-xs font-medium text-neutral-900">Varios</span>
              </label>
            </div>

            {/* If Varios: Limit limits (max quantity total) */}
            {selectionType === 'multiple' && (
              <div className="pt-3 border-t border-neutral-200 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-neutral-600 mb-1">
                    Mínimo a seleccionar
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={minSelect}
                    onChange={(e) => setMinSelect(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-600 mb-1">
                    Máximo a seleccionar (Total)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={maxSelect}
                    onChange={(e) => setMaxSelect(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-900 font-bold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Agregar los modificadores de esta categoría */}
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-900">
                  Opciones de modificadores
                </span>
                <span className="text-xs bg-neutral-200 text-neutral-700 px-1.5 py-0.5 rounded-full font-bold">
                  {options.length}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {options.map((opt) => (
                <div
                  key={opt.id}
                  className="flex items-center gap-2 p-2 rounded-xl bg-white border border-neutral-200"
                >
                  <GripVertical className="w-4 h-4 text-neutral-400 shrink-0" />
                  
                  {/* Option Name */}
                  <input
                    type="text"
                    value={opt.name}
                    onChange={(e) => handleUpdateOption(opt.id, 'name', e.target.value)}
                    placeholder="Nombre del modificador (ej: Puré de papas)"
                    className="flex-1 px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
                  />

                  {/* Option Price */}
                  <div className="flex items-center gap-1 w-28 shrink-0">
                    <span className="text-[11px] text-neutral-500">{currency}</span>
                    <input
                      type="number"
                      step="any"
                      value={opt.price}
                      onChange={(e) =>
                        handleUpdateOption(opt.id, 'price', Number(e.target.value))
                      }
                      placeholder="0.00"
                      className="w-full px-2 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-semibold"
                    />
                  </div>

                  {/* Visibility eye toggle */}
                  <button
                    type="button"
                    onClick={() => handleUpdateOption(opt.id, 'isVisible', !opt.isVisible)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      opt.isVisible !== false
                        ? 'text-neutral-500 hover:text-neutral-800'
                        : 'text-neutral-400 hover:text-neutral-600'
                    }`}
                    title={opt.isVisible !== false ? 'Visible' : 'Oculto'}
                  >
                    {opt.isVisible !== false ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                    )}
                  </button>

                  {/* Delete option */}
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(opt.id)}
                    className="text-neutral-400 hover:text-red-500 p-1.5 cursor-pointer"
                    title="Eliminar opción"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddOption}
              className="mt-3 w-full py-2 border border-dashed border-blue-400 hover:border-blue-600 text-blue-600 hover:text-blue-700 bg-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar modificador</span>
            </button>
          </div>

          {/* Platos y productos asociados */}
          {products.length > 0 && (
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-semibold text-neutral-900">
                    Platos asociados a este modificador
                  </span>
                  <span className="text-[11px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-bold">
                    {selectedProductIds.length} de {products.length} platos
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAllProducts}
                    className="text-[11px] text-blue-600 hover:underline cursor-pointer font-medium"
                  >
                    Seleccionar todos
                  </button>
                  <span className="text-neutral-300">•</span>
                  <button
                    type="button"
                    onClick={handleDeselectAllProducts}
                    className="text-[11px] text-neutral-500 hover:underline cursor-pointer"
                  >
                    Desmarcar todos
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-neutral-600 leading-relaxed">
                Marca los platos donde quieres que aparezca este grupo de modificadores (por ejemplo, salsas para el Pernil, guarniciones para carnes, etc.).
              </p>

              {/* Product Search Input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Buscar plato por nombre..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Product list */}
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {filteredProducts.map((prod) => {
                  const isChecked = selectedProductIds.includes(prod.id);
                  return (
                    <div
                      key={prod.id}
                      onClick={() => handleToggleProduct(prod.id)}
                      className={`flex items-center justify-between p-2 rounded-xl border transition-colors cursor-pointer select-none ${
                        isChecked
                          ? 'bg-blue-50 border-blue-400 text-neutral-900'
                          : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isChecked
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-neutral-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-7 h-7 rounded-md object-cover bg-neutral-100 shrink-0 border border-neutral-200"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-xs font-medium truncate">
                          {prod.name}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 ${
                          isChecked
                            ? 'text-blue-700 bg-blue-100'
                            : 'text-neutral-400'
                        }`}
                      >
                        {isChecked ? 'Asociado' : 'No asociado'}
                      </span>
                    </div>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <p className="text-xs text-neutral-500 text-center py-3">
                    No se encontraron platos que coincidan con la búsqueda.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between gap-3">
            {isEditing && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`¿Eliminar grupo de modificadores "${group.name}"?`)) {
                    onDelete(group.id);
                    onClose();
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white text-xs font-bold shadow-md shadow-blue-600/30 cursor-pointer"
              >
                Guardar Modificadores
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
