import React, { useState } from 'react';
import { Category } from '../../types';
import { X, Trash2 } from 'lucide-react';

interface CategoryModalProps {
  category: Category | null;
  onClose: () => void;
  onSave: (category: Category) => void;
  onDelete?: (categoryId: string) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  category,
  onClose,
  onSave,
  onDelete,
}) => {
  const isEditing = !!category;
  const [name, setName] = useState(category?.name || '');
  const [isVisible, setIsVisible] = useState(category?.isVisible !== false);
  const [isFeatured, setIsFeatured] = useState(category?.isFeatured || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Por favor escribe el nombre de la categoría.');
      return;
    }

    const savedCat: Category = {
      id: category?.id || `cat_${Date.now()}`,
      name: name.trim(),
      order: category?.order || 99,
      isVisible,
      isFeatured,
    };

    onSave(savedCat);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-100">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
          <h3 className="font-bold text-base text-white">
            {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1">
              Nombre de la categoría *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Menú Ejecutivo, Postres, Viandas..."
              required
              autoFocus
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-neutral-800">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-neutral-300">Visible en el menú público</span>
              <input
                type="checkbox"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-neutral-300">Categoría destacada al inicio</span>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </label>
          </div>

          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
            {isEditing && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`¿Eliminar la categoría "${category.name}"?`)) {
                    onDelete(category.id);
                    onClose();
                  }
                }}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
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
                className="px-3.5 py-1.5 rounded-lg bg-neutral-800 text-xs text-neutral-300 hover:bg-neutral-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow cursor-pointer"
              >
                Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
