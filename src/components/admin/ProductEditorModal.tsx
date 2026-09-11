import React, { useState, useRef } from 'react';
import { Product, Category, ModifierGroup, ProductVariant } from '../../types';
import { X, Camera, Plus, Trash2, GripVertical, Check, Eye, EyeOff, AlertTriangle } from 'lucide-react';

interface ProductEditorModalProps {
  product: Product | null; // null if creating new
  categories: Category[];
  modifierGroups: ModifierGroup[];
  currency: string;
  onClose: () => void;
  onSave: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  product,
  categories,
  modifierGroups,
  currency,
  onClose,
  onSave,
  onDelete,
}) => {
  const isEditing = !!product;

  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [imageUrl, setImageUrl] = useState(
    product?.imageUrl ||
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
  );
  const [categoryIds, setCategoryIds] = useState<string[]>(product?.categoryIds || []);
  const [priceType, setPriceType] = useState<'simple' | 'variants'>(
    product?.priceType || 'simple'
  );
  const [simplePrice, setSimplePrice] = useState<number>(product?.simplePrice || 0);
  const [clientNote, setClientNote] = useState<string>(product?.clientNote || '');
  const [variants, setVariants] = useState<ProductVariant[]>(
    product?.variants || [
      { id: 'var_1', name: 'Porción individual', price: 0, isVisible: true },
      { id: 'var_2', name: 'Porción para compartir', price: 0, isVisible: true },
    ]
  );
  const [selectedModifierGroupIds, setSelectedModifierGroupIds] = useState<string[]>(
    product?.modifierGroupIds || []
  );
  const [isHidden, setIsHidden] = useState<boolean>(product?.isHidden || false);
  const [isDiscontinued, setIsDiscontinued] = useState<boolean>(product?.isDiscontinued || false);
  const [isFeatured, setIsFeatured] = useState<boolean>(product?.isFeatured || false);
  const [order, setOrder] = useState<number>(product?.order ?? 1);

  const [showImagePrompt, setShowImagePrompt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 8MB for browser)
    if (file.size > 8 * 1024 * 1024) {
      alert('La imagen no debe superar los 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const result = loadEvt.target?.result as string;
      if (result) {
        setImageUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleToggleCategory = (catId: string) => {
    setCategoryIds((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleAddVariant = () => {
    const newId = `var_${Date.now()}`;
    setVariants((prev) => [
      ...prev,
      { id: newId, name: 'Nueva variante', price: 0, isVisible: true },
    ]);
  };

  const handleUpdateVariant = (
    id: string,
    field: 'name' | 'price',
    value: string | number
  ) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const handleRemoveVariant = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const handleToggleModifierGroup = (groupId: string) => {
    setSelectedModifierGroupIds((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Por favor ingresa el nombre del producto.');
      return;
    }

    const updatedProduct: Product = {
      id: product?.id || `prod_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      categoryIds,
      priceType,
      simplePrice: Number(simplePrice) || 0,
      clientNote: clientNote.trim(),
      variants,
      modifierGroupIds: selectedModifierGroupIds,
      isHidden,
      isDiscontinued,
      isFeatured,
      order: Number(order) || 0,
      categoryOrders: product?.categoryOrders || {},
    };

    onSave(updatedProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-100 my-auto">
        
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
          <h2 className="font-bold text-lg text-white">
            {isEditing ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* Top Section: Photo + Name + Description (matches screenshot 1) */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {/* Photo Box */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 shrink-0 group">
              <img
                src={imageUrl}
                alt="Vista previa"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-transform active:scale-95 cursor-pointer"
                title="Subir foto"
              >
                <Camera className="w-4 h-4" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Name & Description Inputs */}
            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Pernil de Cerdo"
                  required
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">
                  Descripción
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ej: Pernil de Cerdo horneado con dos Salsas y Figacitas"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Image URL custom toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowImagePrompt(!showImagePrompt)}
              className="text-xs text-blue-400 hover:underline"
            >
              {showImagePrompt ? 'Ocultar campo de enlace web' : 'O cambiar mediante enlace URL de imagen'}
            </button>
            {showImagePrompt && (
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://ejemplo.com/foto.jpg"
                className="w-full mt-1.5 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white"
              />
            )}
          </div>

          {/* Categorías (Multi-select) */}
          <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800">
            <label className="block text-xs font-semibold text-neutral-300 mb-2">
              Categorías en las que aparece (puedes marcar varias)
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = categoryIds.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleToggleCategory(cat.id)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Precio(s): Segmented control (matches screenshot 1) */}
          <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-white">Precio(s)</span>
              
              {/* Segmented Tab */}
              <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setPriceType('simple')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    priceType === 'simple'
                      ? 'bg-neutral-800 text-white shadow-xs'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Simple
                </button>
                <button
                  type="button"
                  onClick={() => setPriceType('variants')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                    priceType === 'variants'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span>Variantes</span>
                  <span className="bg-blue-900/60 text-white text-[10px] px-1.5 rounded-full">
                    {variants.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Simple price input */}
            {priceType === 'simple' ? (
              <div>
                <label className="block text-xs text-neutral-400 mb-1">
                  Precio unitario ({currency})
                </label>
                <input
                  type="number"
                  step="any"
                  value={simplePrice}
                  onChange={(e) => setSimplePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-base font-bold text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            ) : (
              /* Variants Section */
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={clientNote}
                    onChange={(e) => setClientNote(e.target.value)}
                    placeholder="Decir a mis clientes (ej: Selecciona la cantidad que rinde)"
                    className="w-full px-3 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  {variants.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center gap-2 p-2 rounded-xl bg-neutral-900 border border-neutral-800"
                    >
                      <GripVertical className="w-4 h-4 text-neutral-600 shrink-0" />
                      
                      <input
                        type="text"
                        value={v.name}
                        onChange={(e) => handleUpdateVariant(v.id, 'name', e.target.value)}
                        placeholder="Nombre de la opción"
                        className="flex-1 px-2.5 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white"
                      />

                      <div className="flex items-center gap-1 w-28">
                        <span className="text-xs text-neutral-500">{currency}</span>
                        <input
                          type="number"
                          step="any"
                          value={v.price}
                          onChange={(e) =>
                            handleUpdateVariant(v.id, 'price', Number(e.target.value))
                          }
                          className="w-full px-2 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white font-semibold"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(v.id)}
                        className="text-neutral-500 hover:text-red-400 p-1.5"
                        title="Eliminar opción"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="w-full py-2 border border-dashed border-blue-500/50 hover:border-blue-500 text-blue-400 hover:text-blue-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar variante</span>
                </button>
              </div>
            )}
          </div>

          {/* Agregar modificadores (matches screenshot 1) */}
          <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">Agregar modificadores</span>
                <span className="text-xs bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded-full font-bold">
                  {selectedModifierGroupIds.length}
                </span>
              </div>
            </div>
            <p className="text-xs text-neutral-500 mb-3">
              Ingredientes, sabores, salsas, guarniciones...
            </p>

            {/* List of modifier groups attached to this product */}
            <div className="space-y-2">
              {modifierGroups.map((group) => {
                const isAttached = selectedModifierGroupIds.includes(group.id);
                const optionsSummary = group.options
                  .slice(0, 4)
                  .map((o) => o.name)
                  .join(', ') + (group.options.length > 4 ? ` (+${group.options.length - 4} más)` : '');

                return (
                  <div
                    key={group.id}
                    onClick={() => handleToggleModifierGroup(group.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      isAttached
                        ? 'bg-blue-600/15 border-blue-500 text-white shadow-sm'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          isAttached ? 'border-blue-500 bg-blue-600 text-white' : 'border-neutral-600 bg-neutral-950'
                        }`}
                      >
                        {isAttached && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-white block">
                            {group.name}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                              group.condition === 'required'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-neutral-800 text-neutral-400'
                            }`}
                          >
                            {group.condition === 'required' ? 'Obligatorio' : 'Opcional'}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                          {optionsSummary || `${group.options.length} opciones`}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg shrink-0 ml-2 ${
                        isAttached
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      {isAttached ? 'Asociado' : 'Asociar'}
                    </span>
                  </div>
                );
              })}

              {modifierGroups.length === 0 && (
                <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 text-center">
                  <p className="text-xs text-neutral-400">
                    No tienes categorías de modificadores creadas todavía.
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Puedes crearlas desde la pestaña &quot;Modificadores&quot; del administrador.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Product Status & Visibility Switches */}
          <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Estado y Visibilidad
            </h4>

            {/* Ocultar del menú */}
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                {isHidden ? (
                  <EyeOff className="w-4 h-4 text-amber-500" />
                ) : (
                  <Eye className="w-4 h-4 text-neutral-400" />
                )}
                <div>
                  <span className="text-xs font-medium text-white block">
                    Ocultar del menú público
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Si está activado, los clientes no verán este producto.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isHidden}
                onChange={(e) => setIsHidden(e.target.checked)}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </label>

            {/* Discontinuado */}
            <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-neutral-900">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <div>
                  <span className="text-xs font-medium text-white block">
                    Producto Discontinuado / Agotado
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Muestra el cartel de Agotado en el menú e impide pedirlo.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isDiscontinued}
                onChange={(e) => setIsDiscontinued(e.target.checked)}
                className="w-4 h-4 accent-red-500 cursor-pointer"
              />
            </label>

            {/* Destacado */}
            <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-neutral-900">
              <div>
                <span className="text-xs font-medium text-white block">
                  Marcar como Producto Destacado (Los más elegidos)
                </span>
                <span className="text-[11px] text-neutral-500">
                  Aparece con insignia especial y en la pestaña "Los más elegidos!!!".
                </span>
              </div>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setIsFeatured(checked);
                  const elegidosCat = categories.find((c) => c.name.toLowerCase().includes('elegidos'));
                  if (elegidosCat) {
                    if (checked) {
                      if (!categoryIds.includes(elegidosCat.id)) {
                        setCategoryIds((prev) => [elegidosCat.id, ...prev]);
                      }
                    } else {
                      // If un-featured, automatically remove from "Los más elegidos" category
                      setCategoryIds((prev) => prev.filter((id) => id !== elegidosCat.id));
                    }
                  }
                }}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </label>

            {/* Posición / Orden en el menú */}
            <div className="pt-2 border-t border-neutral-900 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-white block">
                  Orden / Posición en el menú
                </span>
                <span className="text-[11px] text-neutral-500">
                  Número de posición (1 aparece primero, 2 segundo, etc.).
                </span>
              </div>
              <input
                type="number"
                min="1"
                value={order}
                onChange={(e) => setOrder(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-20 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-bold text-amber-400 text-center focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-3">
            {isEditing && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`¿Estás seguro de eliminar el producto "${product.name}"?`)) {
                    onDelete(product.id);
                    onClose();
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-800/80 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
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
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                id="btn-save-product"
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white text-xs font-bold shadow-md shadow-blue-600/30 cursor-pointer"
              >
                Guardar Producto
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
