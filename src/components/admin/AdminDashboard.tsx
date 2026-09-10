import React, { useState, useRef } from 'react';
import { MenuData, Product, Category, ModifierGroup, BusinessInfo } from '../../types';
import { ProductEditorModal } from './ProductEditorModal';
import { ModifierGroupModal } from './ModifierGroupModal';
import { CategoryModal } from './CategoryModal';
import { BatchImportModal } from './BatchImportModal';
import { ShareAndQRTab } from './ShareAndQRTab';
import { formatPrice } from '../../utils/formatters';
import {
  Utensils,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Camera,
  Layers,
  Sliders,
  Settings,
  ArrowLeft,
  GripVertical,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Phone,
  Search,
  FileSpreadsheet,
  QrCode,
  Lock,
} from 'lucide-react';

interface AdminDashboardProps {
  menuData: MenuData;
  onUpdateMenuData: (newData: MenuData) => void;
  onBackToMenu: () => void;
  onResetData: () => void;
  onLockAdmin?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  menuData,
  onUpdateMenuData,
  onBackToMenu,
  onResetData,
  onLockAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'modifiers' | 'share' | 'settings'>('products');
  
  // Modals state
  const [editingProduct, setEditingProduct] = useState<Product | null | 'new'>(null);
  const [editingModifierGroup, setEditingModifierGroup] = useState<ModifierGroup | null | 'new'>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null | 'new'>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);

  // Filters for product list
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [productSearchQuery, setProductSearchQuery] = useState('');

  const bannerFileRef = useRef<HTMLInputElement>(null);
  const logoFileRef = useRef<HTMLInputElement>(null);

  const { business, categories, products, modifierGroups } = menuData;

  // Batch import from Sheets/Excel
  const handleBatchImport = (
    newProducts: Product[],
    newCategories: Category[],
    mode: 'append' | 'replace'
  ) => {
    const finalProducts = mode === 'replace' ? newProducts : [...products, ...newProducts];
    onUpdateMenuData({
      ...menuData,
      categories: newCategories,
      products: finalProducts,
    });
  };

  // Save changes to menuData
  const updateBusiness = (fields: Partial<BusinessInfo>) => {
    onUpdateMenuData({
      ...menuData,
      business: { ...business, ...fields },
    });
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const res = evt.target?.result as string;
      if (res) updateBusiness({ bannerUrl: res });
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const res = evt.target?.result as string;
      if (res) updateBusiness({ logoUrl: res });
    };
    reader.readAsDataURL(file);
  };

  // --- Product Handlers ---
  const handleSaveProduct = (savedProduct: Product) => {
    const exists = products.some((p) => p.id === savedProduct.id);
    const updatedProducts = exists
      ? products.map((p) => (p.id === savedProduct.id ? savedProduct : p))
      : [savedProduct, ...products];

    onUpdateMenuData({
      ...menuData,
      products: updatedProducts,
    });
  };

  const handleDeleteProduct = (productId: string) => {
    onUpdateMenuData({
      ...menuData,
      products: products.filter((p) => p.id !== productId),
    });
  };

  const handleToggleProductVisibility = (productId: string) => {
    onUpdateMenuData({
      ...menuData,
      products: products.map((p) =>
        p.id === productId ? { ...p, isHidden: !p.isHidden } : p
      ),
    });
  };

  const handleToggleProductDiscontinued = (productId: string) => {
    onUpdateMenuData({
      ...menuData,
      products: products.map((p) =>
        p.id === productId ? { ...p, isDiscontinued: !p.isDiscontinued } : p
      ),
    });
  };

  // --- Category Handlers ---
  const handleSaveCategory = (savedCategory: Category) => {
    const exists = categories.some((c) => c.id === savedCategory.id);
    const updatedCategories = exists
      ? categories.map((c) => (c.id === savedCategory.id ? savedCategory : c))
      : [...categories, savedCategory];

    onUpdateMenuData({
      ...menuData,
      categories: updatedCategories,
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    onUpdateMenuData({
      ...menuData,
      categories: categories.filter((c) => c.id !== categoryId),
      // Remove category from products
      products: products.map((p) => ({
        ...p,
        categoryIds: p.categoryIds.filter((id) => id !== categoryId),
      })),
    });
  };

  const handleToggleCategoryVisibility = (categoryId: string) => {
    onUpdateMenuData({
      ...menuData,
      categories: categories.map((c) =>
        c.id === categoryId ? { ...c, isVisible: !c.isVisible } : c
      ),
    });
  };

  // --- Modifier Handlers ---
  const handleSaveModifierGroup = (
    savedGroup: ModifierGroup,
    associatedProductIds?: string[]
  ) => {
    const exists = modifierGroups.some((g) => g.id === savedGroup.id);
    const updatedGroups = exists
      ? modifierGroups.map((g) => (g.id === savedGroup.id ? savedGroup : g))
      : [...modifierGroups, savedGroup];

    let updatedProducts = products;
    if (associatedProductIds) {
      updatedProducts = products.map((p) => {
        const isAssociated = associatedProductIds.includes(p.id);
        const currentMods = p.modifierGroupIds || [];
        if (isAssociated) {
          return currentMods.includes(savedGroup.id)
            ? p
            : { ...p, modifierGroupIds: [...currentMods, savedGroup.id] };
        } else {
          return currentMods.includes(savedGroup.id)
            ? { ...p, modifierGroupIds: currentMods.filter((id) => id !== savedGroup.id) }
            : p;
        }
      });
    }

    onUpdateMenuData({
      ...menuData,
      modifierGroups: updatedGroups,
      products: updatedProducts,
    });
  };

  const handleDeleteModifierGroup = (groupId: string) => {
    onUpdateMenuData({
      ...menuData,
      modifierGroups: modifierGroups.filter((g) => g.id !== groupId),
      // Remove association from products
      products: products.map((p) => ({
        ...p,
        modifierGroupIds: p.modifierGroupIds.filter((id) => id !== groupId),
      })),
    });
  };

  // Filtered products for admin
  const filteredProducts = products.filter((p) => {
    if (productCategoryFilter !== 'all') {
      if (!p.categoryIds.includes(productCategoryFilter)) return false;
    }
    if (productSearchQuery.trim()) {
      const q = productSearchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pb-20">
      
      {/* Top Admin Bar with cover & logo (matches Screenshot 2) */}
      <div className="relative bg-neutral-900 border-b border-neutral-800">
        
        {/* Banner Cover */}
        <div className="relative h-44 sm:h-56 w-full bg-neutral-950 overflow-hidden">
          <img
            src={business.bannerUrl}
            alt="Portada del negocio"
            className="w-full h-full object-cover brightness-70"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/40" />

          {/* Banner change button */}
          <button
            onClick={() => bannerFileRef.current?.click()}
            className="absolute top-4 right-4 bg-black/60 hover:bg-black/90 text-white text-xs font-semibold px-3 py-1.5 rounded-lg backdrop-blur flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Cambiar portada</span>
          </button>
          <input
            ref={bannerFileRef}
            type="file"
            accept="image/*"
            onChange={handleBannerUpload}
            className="hidden"
          />

          {/* Back to Public Menu Button & Lock */}
          <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
            <button
              id="btn-return-to-menu"
              onClick={onBackToMenu}
              className="bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ver Menú</span>
            </button>

            {onLockAdmin && (
              <button
                onClick={onLockAdmin}
                className="bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-neutral-700 shadow-md flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-xs"
                title="Bloquear panel de administración con PIN"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Bloquear</span>
              </button>
            )}
          </div>
        </div>

        {/* Business Header Info */}
        <div className="max-w-6xl mx-auto px-4 pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 relative z-10">
            
            {/* Logo + Business name */}
            <div className="flex items-end gap-3.5">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-neutral-900 bg-neutral-950 overflow-hidden shadow-xl shrink-0 group">
                <img
                  src={business.logoUrl}
                  alt="Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => logoFileRef.current?.click()}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                  title="Cambiar logo"
                >
                  <Camera className="w-6 h-6" />
                </button>
                <input
                  ref={logoFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>

              <div className="mb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white">{business.name}</h1>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    En la nube
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                  <Phone className="w-3 h-3 text-green-400" />
                  <span>WhatsApp pedidos: <strong>+{business.whatsappPhone}</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              <button
                onClick={() => setActiveTab('share')}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Compartir enlace y ver código QR del menú"
              >
                <QrCode className="w-4 h-4" />
                <span>Compartir & QR</span>
              </button>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Cargar productos copiando y pegando desde Google Sheets o Excel"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Importar Sheets</span>
              </button>
              <button
                onClick={() => setEditingProduct('new')}
                className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Producto</span>
              </button>
              <button
                onClick={() => setEditingCategory('new')}
                className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Nueva</span> Categoría
              </button>
            </div>
          </div>

          {/* Admin Navigation Tabs (matches Screenshot 2 layout) */}
          <div className="mt-6 flex items-center gap-2 border-b border-neutral-800 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Productos ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'categories'
                  ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Categorías ({categories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('modifiers')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'modifiers'
                  ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Modificadores ({modifierGroups.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('share')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'share'
                  ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Compartir y Código QR</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Configuración Negocio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area based on Tab */}
      <main className="max-w-6xl mx-auto px-4 pt-6">
        
        {/* Direct Sync & Publish Helper Banner */}
        <div className="mb-5 bg-gradient-to-r from-blue-950/60 to-indigo-950/40 border border-blue-800/40 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-blue-200 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              <strong>Edición directa habilitada:</strong> Todo cambio que hagas en el catálogo (precios, fotos, platos) se guarda en tu código. Al finalizar, solo ve a la pestaña <strong>GitHub</strong> arriba y presiona <strong>«Push changes to GitHub»</strong> para publicar en Vercel.
            </span>
          </div>
        </div>
        
        {/* ================= PRODUCTS TAB ================= */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Header with Title and Import Shortcut */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-white">Catálogo de Productos ({products.length})</h2>
                <p className="text-xs text-neutral-400">
                  Administra platos, precios, categorías y disponibilidad en el menú.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="px-3.5 py-1.5 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Importar desde Sheets</span>
                </button>
                <button
                  onClick={() => setEditingProduct('new')}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Crear Plato</span>
                </button>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-900/60 p-3 rounded-2xl border border-neutral-800">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  placeholder="Buscar producto por nombre..."
                  className="w-full pl-9 pr-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Category filter pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar py-1">
                <button
                  onClick={() => setProductCategoryFilter('all')}
                  className={`text-xs px-3 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    productCategoryFilter === 'all'
                      ? 'bg-neutral-200 text-neutral-950 font-bold'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  Todas
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setProductCategoryFilter(cat.id)}
                    className={`text-xs px-3 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                      productCategoryFilter === cat.id
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Table / Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((p) => {
                const assignedCategories = categories.filter((c) =>
                  p.categoryIds.includes(c.id)
                );

                return (
                  <div
                    key={p.id}
                    className={`bg-neutral-900 border rounded-2xl p-4 flex flex-col justify-between transition-all ${
                      p.isHidden
                        ? 'border-neutral-800/60 opacity-60 bg-neutral-950'
                        : 'border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div>
                      {/* Image & Quick status */}
                      <div className="flex gap-3 items-start">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-20 h-20 rounded-xl object-cover bg-neutral-950 shrink-0 border border-neutral-800"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <h3 className="font-bold text-sm text-white truncate">
                              {p.name}
                            </h3>
                            {p.isFeatured && (
                              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            )}
                          </div>

                          <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                            {p.description}
                          </p>

                          <div className="mt-2 text-xs font-bold text-blue-400">
                            {p.priceType === 'variants'
                              ? `${p.variants.length} variantes`
                              : formatPrice(p.simplePrice, business.currency)}
                          </div>
                        </div>
                      </div>

                      {/* Categories Badges */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {assignedCategories.map((c) => (
                          <span
                            key={c.id}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400"
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>

                      {/* Modifiers count */}
                      {p.modifierGroupIds.length > 0 && (
                        <div className="mt-2 text-[11px] text-neutral-500">
                          🔧 {p.modifierGroupIds.length} grupos de modificadores
                        </div>
                      )}
                    </div>

                    {/* Card Actions & Toggles */}
                    <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
                      {/* Toggles */}
                      <div className="flex items-center gap-2">
                        {/* Eye toggle: Ocultar / Mostrar */}
                        <button
                          type="button"
                          onClick={() => handleToggleProductVisibility(p.id)}
                          className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                            p.isHidden
                              ? 'bg-amber-950/40 border-amber-800 text-amber-400'
                              : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white'
                          }`}
                          title={p.isHidden ? 'Producto Oculto (haz clic para mostrar)' : 'Producto Visible'}
                        >
                          {p.isHidden ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                          <span className="text-[10px]">
                            {p.isHidden ? 'Oculto' : 'Visible'}
                          </span>
                        </button>

                        {/* Discontinued toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleProductDiscontinued(p.id)}
                          className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                            p.isDiscontinued
                              ? 'bg-red-950/50 border-red-800 text-red-400'
                              : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-neutral-200'
                          }`}
                          title={p.isDiscontinued ? 'Discontinuado' : 'Disponible'}
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span className="text-[10px]">
                            {p.isDiscontinued ? 'Agotado' : 'Activo'}
                          </span>
                        </button>
                      </div>

                      {/* Edit button */}
                      <button
                        type="button"
                        onClick={() => setEditingProduct(p)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= CATEGORIES TAB (matches Screenshot 2) ================= */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Lista de Categorías</h2>
                <p className="text-xs text-neutral-400">
                  Organiza las secciones de tu menú digital. Los productos pueden estar en varias categorías.
                </p>
              </div>

              <button
                onClick={() => setEditingCategory('new')}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Crear categoría</span>
              </button>
            </div>

            {/* List of categories rows (exact visual feel of Screenshot 2) */}
            <div className="space-y-2">
              {categories.map((cat) => {
                const productCount = products.filter((p) =>
                  p.categoryIds.includes(cat.id)
                ).length;

                return (
                  <div
                    key={cat.id}
                    className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5 flex items-center justify-between gap-3 hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <GripVertical className="w-4 h-4 text-neutral-600 shrink-0 cursor-grab" />
                      
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-bold text-white block truncate">
                          {cat.name}
                        </span>
                        <span className="text-[11px] text-neutral-400">
                          {productCount} producto{productCount !== 1 ? 's' : ''} asignado{productCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* + Producto button */}
                      <button
                        onClick={() => {
                          const newProductTemplate: Product = {
                            id: `prod_${Date.now()}`,
                            name: '',
                            description: '',
                            imageUrl:
                              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
                            categoryIds: [cat.id],
                            priceType: 'simple',
                            simplePrice: 0,
                            variants: [],
                            modifierGroupIds: [],
                            isDiscontinued: false,
                            isHidden: false,
                            order: 0,
                          };
                          setEditingProduct(newProductTemplate);
                        }}
                        className="px-3 py-1.5 bg-neutral-800 hover:bg-blue-600 text-neutral-200 hover:text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Producto</span>
                      </button>

                      {/* Toggle visibility */}
                      <button
                        onClick={() => handleToggleCategoryVisibility(cat.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          cat.isVisible !== false
                            ? 'text-neutral-400 border-neutral-800 hover:text-white'
                            : 'text-amber-500 border-amber-800 bg-amber-950/30'
                        }`}
                        title={cat.isVisible !== false ? 'Categoría Visible' : 'Categoría Oculta'}
                      >
                        {cat.isVisible !== false ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>

                      {/* Edit category */}
                      <button
                        onClick={() => setEditingCategory(cat)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors"
                        title="Editar nombre"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= MODIFIERS TAB (matches Screenshot 3) ================= */}
        {activeTab === 'modifiers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Categorías de Modificadores</h2>
                <p className="text-xs text-neutral-400">
                  Configura salsas, guarniciones, extras y puntos de cocción con selección única o múltiple y precios opcionales.
                </p>
              </div>

              <button
                onClick={() => setEditingModifierGroup('new')}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Crear modificador</span>
              </button>
            </div>

            {/* Grid of Modifier Groups */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {modifierGroups.map((group) => {
                const associatedProductsCount = products.filter((p) =>
                  p.modifierGroupIds.includes(group.id)
                ).length;

                return (
                  <div
                    key={group.id}
                    className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-bold text-base text-white">{group.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                group.condition === 'required'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : 'bg-neutral-800 text-neutral-400'
                              }`}
                            >
                              {group.condition === 'required' ? 'Obligatorio' : 'Opcional'}
                            </span>

                            <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full">
                              {group.selectionType === 'single'
                                ? 'Sólo un modificador'
                                : `Varios (hasta ${group.maxSelect || 'ilimitado'})`}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => setEditingModifierGroup(group)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                          title="Editar grupo de modificadores"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Options preview */}
                      <div className="mt-3 space-y-1 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800/80">
                        <span className="text-[11px] font-semibold text-neutral-400 block mb-1">
                          Opciones disponibles ({group.options.length}):
                        </span>
                        {group.options.map((opt) => (
                          <div
                            key={opt.id}
                            className="flex items-center justify-between text-xs py-1 px-1 text-neutral-300 border-b border-neutral-900 last:border-0"
                          >
                            <span>• {opt.name}</span>
                            <span className="font-semibold text-neutral-400">
                              {opt.price > 0
                                ? `+ ${formatPrice(opt.price, business.currency)}`
                                : 'Incluido'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-2 border-t border-neutral-800 text-xs text-neutral-500 flex items-center justify-between">
                      <span>Asociado a {associatedProductsCount} plato{associatedProductsCount !== 1 ? 's' : ''}</span>
                      <button
                        onClick={() => setEditingModifierGroup(group)}
                        className="text-blue-400 hover:underline text-xs font-semibold"
                      >
                        Configurar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= BUSINESS SETTINGS TAB ================= */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Datos del Negocio y WhatsApp</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Configura los datos que verán tus clientes y el número de WhatsApp donde se recibirán los pedidos.
              </p>
            </div>

            <div className="space-y-4">
              {/* WhatsApp Phone */}
              <div className="p-4 bg-emerald-950/30 border border-emerald-800/60 rounded-xl space-y-1">
                <label className="block text-xs font-bold text-emerald-300">
                  Número de WhatsApp para pedidos (ej: 1134501611 o 5491134501611) *
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono text-neutral-400">+</span>
                  <input
                    type="text"
                    value={business.whatsappPhone}
                    onChange={(e) => updateBusiness({ whatsappPhone: e.target.value })}
                    placeholder="Ej: 1134501611"
                    className="flex-1 px-3 py-2 bg-neutral-950 border border-emerald-700/60 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-1">
                  <span>Los pedidos del carrito se enviarán directamente a este WhatsApp.</span>
                  <span className="text-emerald-400 font-mono">
                    Enlace de envío: +{business.whatsappPhone}
                  </span>
                </div>
              </div>

              {/* Business Name */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Nombre del Restaurante / Negocio
                </label>
                <input
                  type="text"
                  value={business.name}
                  onChange={(e) => updateBusiness({ name: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Descripción o Mensaje de Bienvenida
                </label>
                <textarea
                  rows={2}
                  value={business.description}
                  onChange={(e) => updateBusiness({ description: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Address and Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={business.address}
                    onChange={(e) => updateBusiness({ address: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Horarios de atención
                  </label>
                  <input
                    type="text"
                    value={business.hours}
                    onChange={(e) => updateBusiness({ hours: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Currency symbol */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Símbolo de Moneda (ej: $, ARS, USD)
                </label>
                <input
                  type="text"
                  value={business.currency}
                  onChange={(e) => updateBusiness({ currency: e.target.value })}
                  className="w-24 px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Modalities available */}
              <div className="pt-2 border-t border-neutral-800 space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-neutral-300">Ofrecer Envío a Domicilio (Delivery)</span>
                  <input
                    type="checkbox"
                    checked={business.deliveryAvailable}
                    onChange={(e) => updateBusiness({ deliveryAvailable: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs text-neutral-300">Ofrecer Retiro en el Local (Takeaway)</span>
                  <input
                    type="checkbox"
                    checked={business.takeawayAvailable}
                    onChange={(e) => updateBusiness({ takeawayAvailable: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </label>
              </div>

              {/* Reset to demo seed data */}
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block font-semibold">
                    Restaurar datos de ejemplo
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Restaura los platos de prueba de Guateque Manduca
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('¿Deseas restaurar los productos y categorías de ejemplo?')) {
                      onResetData();
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg border border-neutral-700 hover:border-neutral-600 text-xs text-neutral-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= SHARE & QR TAB ================= */}
        {activeTab === 'share' && <ShareAndQRTab business={business} />}
      </main>

      {/* Product Editor Modal */}
      {editingProduct && (
        <ProductEditorModal
          product={editingProduct === 'new' ? null : editingProduct}
          categories={categories}
          modifierGroups={modifierGroups}
          currency={business.currency}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaveProduct}
          onDelete={handleDeleteProduct}
        />
      )}

      {/* Category Modal */}
      {editingCategory && (
        <CategoryModal
          category={editingCategory === 'new' ? null : editingCategory}
          onClose={() => setEditingCategory(null)}
          onSave={handleSaveCategory}
          onDelete={handleDeleteCategory}
        />
      )}

      {/* Modifier Group Modal */}
      {editingModifierGroup && (
        <ModifierGroupModal
          group={editingModifierGroup === 'new' ? null : editingModifierGroup}
          products={products}
          currency={business.currency}
          onClose={() => setEditingModifierGroup(null)}
          onSave={handleSaveModifierGroup}
          onDelete={handleDeleteModifierGroup}
        />
      )}

      {/* Batch Import from Sheets / Excel Modal */}
      {isImportModalOpen && (
        <BatchImportModal
          existingCategories={categories}
          currency={business.currency}
          onClose={() => setIsImportModalOpen(false)}
          onImport={handleBatchImport}
        />
      )}
    </div>
  );
};
