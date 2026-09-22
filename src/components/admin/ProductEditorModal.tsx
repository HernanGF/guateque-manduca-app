import React, { useState, useRef } from 'react';
import { Product, Category, ModifierGroup, ProductVariant } from '../../types';
import { X, Camera, Plus, Trash2, GripVertical, Check, Eye, EyeOff, AlertTriangle, Package, Loader2 } from 'lucide-react';
import { parseProductDescription, isCateringProduct } from '../ProductDescription';
import { optimizeImageFile } from '../../utils/imageOptimizer';

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
  const [isOptimizingImage, setIsOptimizingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('La imagen no debe superar los 15MB.');
      return;
    }

    try {
      setIsOptimizingImage(true);
      const optimizedUrl = await optimizeImageFile(file, 1000, 0.85);
      setImageUrl(optimizedUrl);
    } catch (err) {
      console.error('Error optimizing image:', err);
      // Fallback to basic file reader
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const result = loadEvt.target?.result as string;
        if (result) setImageUrl(result);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsOptimizingImage(false);
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden text-neutral-900 my-auto">
        
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <h2 className="font-bold text-lg text-neutral-900">
            {isEditing ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-700 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* Top Section: Photo + Name + Description */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {/* Photo Box */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 shrink-0 group">
              <img
                src={imageUrl}
                alt="Vista previa"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isOptimizingImage}
                className="absolute bottom-2 right-2 p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
                title="Subir foto"
              >
                {isOptimizingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
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
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Pernil de Cerdo"
                  required
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-neutral-700">
                    Descripción / Contenido del Box
                  </label>
                  <span className="text-[11px] text-neutral-500">
                    Enter para separar viandas
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ej para Boxes de viandas:&#10;1 Cavatelli a la Bolognesa&#10;1 Fetuccini a la Parisienne&#10;1 Tortilla de Papas&#10;Productos envasados al vacío y congelados."
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-blue-500 focus:bg-white font-mono text-xs sm:text-sm leading-relaxed"
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  💡 En boxes o combos, escribe cada vianda en una línea distinta (presionando Enter). Se mostrarán ordenadas como lista para tus clientes.
                </p>

                {/* Live description & storage note preview */}
                {(() => {
                  const isCatering = isCateringProduct(categoryIds, categories);
                  const parsed = parseProductDescription(description, isCatering);

                  return (
                    <div className="mt-2.5 p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-700 mb-2">
                        <div className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5" />
                          <span>
                            {parsed.isList
                              ? isCatering
                                ? `Vista previa del Box (${parsed.items.length} ítems):`
                                : `Vista previa del Box (${parsed.items.length} viandas):`
                              : 'Vista previa:'}
                          </span>
                        </div>
                        {isCatering ? (
                          <span className="text-[10px] text-neutral-600 bg-neutral-200 px-2 py-0.5 rounded border border-neutral-300">
                            Categoría Catering
                          </span>
                        ) : null}
                      </div>

                      {parsed.isList ? (
                        <div className="space-y-1">
                          {parsed.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-xs text-neutral-700">
                              <span className="text-amber-500 font-bold">•</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-neutral-700 leading-relaxed">
                          {parsed.mainText || (description ? description : 'Sin descripción')}
                        </p>
                      )}

                      {parsed.footerNote ? (
                        <div className="text-[11px] text-neutral-600 italic mt-2 pt-2 border-t border-neutral-200 flex items-center gap-1.5">
                          <span className="text-sky-600 text-xs">❄️</span>
                          <span>{parsed.footerNote}</span>
                        </div>
                      ) : isCatering ? (
                        <p className="text-[11px] text-neutral-500 italic mt-1.5 pt-1.5 border-t border-neutral-200">
                          ℹ️ Los productos de Catering no llevan la indicación de envasado al vacío ni congelado.
                        </p>
                      ) : null}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Image URL custom toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowImagePrompt(!showImagePrompt)}
              className="text-xs text-blue-600 hover:underline cursor-pointer"
            >
              {showImagePrompt ? 'Ocultar campo de enlace web' : 'O cambiar mediante enlace URL de imagen'}
            </button>
            {showImagePrompt && (
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://ejemplo.com/foto.jpg"
                className="w-full mt-1.5 px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-900 focus:bg-white"
              />
            )}
          </div>

          {/* Categorías (Multi-select) */}
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            <label className="block text-xs font-semibold text-neutral-800 mb-2">
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
                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold'
                        : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Precio(s): Segmented control */}
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-neutral-900">Precio(s)</span>
              
              {/* Segmented Tab */}
              <div className="flex bg-neutral-200 border border-neutral-300 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setPriceType('simple')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    priceType === 'simple'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Simple
                </button>
                <button
                  type="button"
                  onClick={() => setPriceType('variants')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                    priceType === 'variants'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <span>Variantes</span>
                  <span className="bg-blue-800 text-white text-[10px] px-1.5 rounded-full">
                    {variants.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Simple price input */}
            {priceType === 'simple' ? (
              <div>
                <label className="block text-xs text-neutral-600 mb-1">
                  Precio unitario ({currency})
                </label>
                <input
                  type="number"
                  step="any"
                  value={simplePrice}
                  onChange={(e) => setSimplePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-base font-bold text-neutral-900 focus:outline-none focus:border-blue-500"
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
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  {variants.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center gap-2 p-2 rounded-xl bg-white border border-neutral-200"
                    >
                      <GripVertical className="w-4 h-4 text-neutral-400 shrink-0" />
                      
                      <input
                        type="text"
                        value={v.name}
                        onChange={(e) => handleUpdateVariant(v.id, 'name', e.target.value)}
                        placeholder="Nombre de la opción"
                        className="flex-1 px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
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
                          className="w-full px-2 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-semibold"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(v.id)}
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
                  onClick={handleAddVariant}
                  className="w-full py-2 border border-dashed border-blue-400 hover:border-blue-600 text-blue-600 hover:text-blue-700 bg-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar variante</span>
                </button>
              </div>
            )}
          </div>

          {/* Agregar modificadores */}
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-neutral-900">Agregar modificadores</span>
                <span className="text-xs bg-neutral-200 text-neutral-700 px-1.5 py-0.5 rounded-full font-bold">
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
                        ? 'bg-blue-50 border-blue-500 text-neutral-900 shadow-xs'
                        : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          isAttached ? 'border-blue-600 bg-blue-600 text-white' : 'border-neutral-300 bg-white'
                        }`}
                      >
                        {isAttached && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-neutral-900 block">
                            {group.name}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                              group.condition === 'required'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-neutral-200 text-neutral-600'
                            }`}
                          >
                            {group.condition === 'required' ? 'Obligatorio' : 'Opcional'}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                          {optionsSummary || `${group.options.length} opciones`}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg shrink-0 ml-2 ${
                        isAttached
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {isAttached ? 'Asociado' : 'Asociar'}
                    </span>
                  </div>
                );
              })}

              {modifierGroups.length === 0 && (
                <div className="p-4 rounded-xl bg-white border border-neutral-200 text-center">
                  <p className="text-xs text-neutral-600">
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
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Estado y Visibilidad
            </h4>

            {/* Ocultar del menú */}
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                {isHidden ? (
                  <EyeOff className="w-4 h-4 text-amber-600" />
                ) : (
                  <Eye className="w-4 h-4 text-neutral-400" />
                )}
                <div>
                  <span className="text-xs font-medium text-neutral-900 block">
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
            <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-neutral-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <div>
                  <span className="text-xs font-medium text-neutral-900 block">
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
            <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-neutral-200">
              <div>
                <span className="text-xs font-medium text-neutral-900 block">
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
            <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-neutral-900 block">
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
                className="w-20 px-3 py-1.5 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-amber-700 text-center focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between gap-3">
            {isEditing && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`¿Estás seguro de eliminar el producto "${product.name}"?`)) {
                    onDelete(product.id);
                    onClose();
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
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
