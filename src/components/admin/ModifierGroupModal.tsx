import React, { useState } from 'react';
import { ModifierGroup, ModifierOption } from '../../types';
import { X, Plus, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';

interface ModifierGroupModalProps {
  group: ModifierGroup | null; // null if creating new
  currency: string;
  onClose: () => void;
  onSave: (group: ModifierGroup) => void;
  onDelete?: (groupId: string) => void;
}

export const ModifierGroupModal: React.FC<ModifierGroupModalProps> = ({
  group,
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

    onSave(savedGroup);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-100 my-auto">
        
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
          <h2 className="font-bold text-lg text-white">
            {isEditing ? 'Editar modificadores' : 'Crear modificadores'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body (matches Screenshot 3) */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto space-y-5">
          
          {/* Group Name input */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1">
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
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500 pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-neutral-500">
                {name.length}/150
              </span>
            </div>
          </div>

          {/* Seleccionar la condición: Obligatorio vs Opcional */}
          <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800">
            <label className="block text-xs font-semibold text-neutral-300 mb-2.5">
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
                <span className="text-xs font-medium text-white">Obligatorio</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="condition"
                  checked={condition === 'optional'}
                  onChange={() => setCondition('optional')}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <span className="text-xs font-medium text-white">Opcional</span>
              </label>
            </div>
          </div>

          {/* En esta categoría se puede seleccionar: Sólo un modificador vs Varios */}
          <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800 space-y-3">
            <label className="block text-xs font-semibold text-neutral-300 mb-2">
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
                <span className="text-xs font-medium text-white">Sólo un modificador</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="selectionType"
                  checked={selectionType === 'multiple'}
                  onChange={() => setSelectionType('multiple')}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
                <span className="text-xs font-medium text-white">Varios</span>
              </label>
            </div>

            {/* If Varios: Limit limits (max quantity total) */}
            {selectionType === 'multiple' && (
              <div className="pt-3 border-t border-neutral-900 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">
                    Mínimo a seleccionar
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={minSelect}
                    onChange={(e) => setMinSelect(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">
                    Máximo a seleccionar (Total)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={maxSelect}
                    onChange={(e) => setMaxSelect(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white font-bold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Agregar los modificadores de esta categoría */}
          <div className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white">
                  Opciones de modificadores
                </span>
                <span className="text-xs bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded-full font-bold">
                  {options.length}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {options.map((opt) => (
                <div
                  key={opt.id}
                  className="flex items-center gap-2 p-2 rounded-xl bg-neutral-900 border border-neutral-800"
                >
                  <GripVertical className="w-4 h-4 text-neutral-600 shrink-0" />
                  
                  {/* Option Name */}
                  <input
                    type="text"
                    value={opt.name}
                    onChange={(e) => handleUpdateOption(opt.id, 'name', e.target.value)}
                    placeholder="Nombre del modificador (ej: Puré de papas)"
                    className="flex-1 px-2.5 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white"
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
                      className="w-full px-2 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white font-semibold"
                    />
                  </div>

                  {/* Visibility eye toggle */}
                  <button
                    type="button"
                    onClick={() => handleUpdateOption(opt.id, 'isVisible', !opt.isVisible)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      opt.isVisible !== false
                        ? 'text-neutral-400 hover:text-white'
                        : 'text-neutral-600 hover:text-neutral-400'
                    }`}
                    title={opt.isVisible !== false ? 'Visible' : 'Oculto'}
                  >
                    {opt.isVisible !== false ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-amber-500" />
                    )}
                  </button>

                  {/* Delete option */}
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(opt.id)}
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
              onClick={handleAddOption}
              className="mt-3 w-full py-2 border border-dashed border-blue-500/50 hover:border-blue-500 text-blue-400 hover:text-blue-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar modificador</span>
            </button>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-3">
            {isEditing && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`¿Eliminar grupo de modificadores "${group.name}"?`)) {
                    onDelete(group.id);
                    onClose();
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-800/80 text-red-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
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
