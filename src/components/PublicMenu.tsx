import React, { useState, useMemo } from 'react';
import { MenuData, Product } from '../types';
import { formatPrice } from '../utils/formatters';
import { Search, ShoppingBag, ArrowLeft, Lock, Sparkles, Plus, AlertCircle, List, LayoutGrid } from 'lucide-react';

interface PublicMenuProps {
  menuData: MenuData;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onSelectProduct: (product: Product) => void;
  onBackToWelcome: () => void;
  onOpenAdmin: () => void;
}

export const PublicMenu: React.FC<PublicMenuProps> = ({
  menuData,
  cartCount,
  cartTotal,
  onOpenCart,
  onSelectProduct,
  onBackToWelcome,
  onOpenAdmin,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const { business, categories, products } = menuData;

  // Visible categories
  const visibleCategories = useMemo(() => {
    return categories
      .filter((c) => c.isVisible !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [categories]);

  // Filtered products: only visible ones, matching search & category
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => !p.isHidden) // Never show hidden products to public
      .filter((p) => {
        // Category filter
        if (selectedCategoryId !== 'all') {
          // If viewing "Los más elegidos", show products marked as isFeatured or explicitly assigned to cat_los-mas-elegidos
          if (selectedCategoryId === 'cat_los-mas-elegidos') {
            const hasCat = p.categoryIds && p.categoryIds.includes('cat_los-mas-elegidos');
            if (!p.isFeatured && !hasCat) {
              return false;
            }
          } else {
            if (!p.categoryIds || !p.categoryIds.includes(selectedCategoryId)) {
              return false;
            }
          }
        }
        // Search query filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(query);
          const matchDesc = p.description.toLowerCase().includes(query);
          return matchName || matchDesc;
        }
        return true;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [products, selectedCategoryId, searchQuery]);

  const getProductPriceLabel = (product: Product) => {
    if (product.priceType === 'variants' && product.variants.length > 0) {
      const activeVariants = product.variants.filter((v) => v.isVisible !== false);
      if (activeVariants.length > 0) {
        const prices = activeVariants.map((v) => v.price).filter((p) => p > 0);
        if (prices.length > 0) {
          const minPrice = Math.min(...prices);
          return `Desde ${formatPrice(minPrice, business.currency)}`;
        }
      }
      return 'Consultar';
    }
    return formatPrice(product.simplePrice || 0, business.currency);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pb-28">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <button
              id="btn-back-to-welcome"
              onClick={onBackToWelcome}
              className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Volver a la portada"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <img
                src={business.logoUrl}
                alt="Logo"
                className="w-9 h-9 rounded-full object-cover border border-neutral-700 bg-neutral-900 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="leading-tight hidden xs:block">
                <h1 className="font-bold text-sm sm:text-base text-white truncate max-w-[160px] sm:max-w-xs">
                  {business.name}
                </h1>
                <span className="text-[11px] text-neutral-400 block">Menú interactivo</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Discreet Lock Switcher */}
            <button
              id="btn-admin-access-header"
              onClick={onOpenAdmin}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-500 hover:text-amber-400 hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-all cursor-pointer"
              title="Acceso seguro"
              aria-label="Acceso seguro"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Cart Button */}
            <button
              id="btn-open-cart-header"
              onClick={onOpenCart}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-neutral-950 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-amber-500">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">
                {cartCount > 0 ? formatPrice(cartTotal, business.currency) : 'Ver Carrito'}
              </span>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="max-w-6xl mx-auto px-4 pb-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-products"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar platos, viandas, catering..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Category horizontal scroll bar */}
        <div className="border-t border-neutral-800/60 bg-neutral-950/95 overflow-x-auto no-scrollbar">
          <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-2">
            <button
              onClick={() => setSelectedCategoryId('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategoryId === 'all'
                  ? 'bg-white text-neutral-950 shadow-sm'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-neutral-700'
              }`}
            >
              Todos los platos
            </button>

            {visibleCategories.map((cat) => {
              const isActive = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-neutral-950 shadow-sm'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Catalog View */}
      <main className="max-w-6xl mx-auto px-4 pt-6">
        {/* Results Title and View Mode Selector */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">
              {selectedCategoryId === 'all'
                ? 'Carta Completa'
                : visibleCategories.find((c) => c.id === selectedCategoryId)?.name || 'Categoría'}
            </h2>
            <span className="text-xs text-neutral-500">
              ({filteredProducts.length} productos)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Vista Lista / Cuadrícula */}
            <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-0.5 gap-0.5">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-neutral-800 text-amber-400 font-bold shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Vista Lista: foto completa 1:1 sin recortar"
              >
                <List className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium">Lista</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-neutral-800 text-amber-400 font-bold shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Vista Cuadrícula"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium">Cuadrícula</span>
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="py-16 text-center bg-neutral-900/50 border border-neutral-800/80 rounded-2xl p-6">
            <AlertCircle className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-300 font-semibold text-sm">No encontramos productos</p>
            <p className="text-xs text-neutral-500 mt-1">
              Prueba buscando con otro término o selecciona otra categoría.
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-xs font-semibold text-amber-400 hover:underline cursor-pointer"
              >
                Ver todos los productos
              </button>
            )}
          </div>
        )}

        {/* Products Display: List View (Square 1:1 photos, full dish visible) OR Grid View */}
        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {filteredProducts.map((product) => {
              const isDiscontinued = product.isDiscontinued;

              return (
                <div
                  key={product.id}
                  onClick={() => {
                    if (!isDiscontinued) {
                      onSelectProduct(product);
                    }
                  }}
                  className={`group relative bg-neutral-900/80 border rounded-2xl p-3.5 sm:p-4 transition-all duration-200 flex items-center justify-between gap-3.5 sm:gap-4 ${
                    isDiscontinued
                      ? 'border-neutral-800 opacity-60 cursor-not-allowed'
                      : 'border-neutral-800 hover:border-neutral-700 hover:shadow-xl hover:shadow-neutral-950/40 cursor-pointer'
                  }`}
                >
                  {/* Left: Product Information */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                    <div>
                      {/* Badges */}
                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        {!isDiscontinued && product.isFeatured && (
                          <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                            <Sparkles className="w-3 h-3" />
                            Destacado
                          </span>
                        )}
                        {product.priceType === 'variants' && !isDiscontinued && (
                          <span className="bg-neutral-800 text-neutral-300 text-xs font-medium px-2.5 py-0.5 rounded-md border border-neutral-700">
                            Con opciones
                          </span>
                        )}
                        {product.modifierGroupIds && product.modifierGroupIds.length > 0 && !isDiscontinued && (
                          <span className="bg-blue-950/70 text-blue-300 border border-blue-800/80 text-xs font-medium px-2.5 py-0.5 rounded-md flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-blue-400" />
                            Salsas / Extras
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-base sm:text-lg text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-sm text-neutral-300 mt-1.5 line-clamp-3 leading-relaxed font-normal">
                        {product.description}
                      </p>
                    </div>

                    {/* Bottom Price & Button */}
                    <div className="mt-3.5 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-neutral-400 block uppercase tracking-wider font-semibold">Precio</span>
                        <span className="text-base sm:text-lg font-black text-amber-400">
                          {getProductPriceLabel(product)}
                        </span>
                      </div>

                      {!isDiscontinued ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProduct(product);
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-800 group-hover:bg-amber-500 group-hover:text-neutral-950 text-neutral-200 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>
                            {product.priceType === 'variants'
                              ? 'Opciones'
                              : product.modifierGroupIds && product.modifierGroupIds.length > 0
                              ? 'Personalizar'
                              : 'Pedir'}
                          </span>
                        </button>
                      ) : (
                        <span className="text-sm text-neutral-500 font-medium">Agotado</span>
                      )}
                    </div>
                  </div>

                  {/* Right: Square 1:1 image thumbnail (Shows 100% of the food, no severe crop) */}
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-xl overflow-hidden shrink-0 bg-neutral-950 border border-neutral-800 shadow-inner">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    {isDiscontinued && (
                      <div className="absolute inset-0 bg-neutral-950/75 backdrop-blur-xs flex items-center justify-center p-1 text-center">
                        <span className="text-[10px] bg-red-500 text-white font-bold uppercase rounded px-1.5 py-0.5">
                          Agotado
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Grid View with natural 4:3 aspect ratio */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => {
              const isDiscontinued = product.isDiscontinued;

              return (
                <div
                  key={product.id}
                  onClick={() => {
                    if (!isDiscontinued) {
                      onSelectProduct(product);
                    }
                  }}
                  className={`group relative bg-neutral-900/80 border rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between ${
                    isDiscontinued
                      ? 'border-neutral-800 opacity-60 cursor-not-allowed'
                      : 'border-neutral-800 hover:border-neutral-700 hover:shadow-xl hover:shadow-neutral-950/40 cursor-pointer'
                  }`}
                >
                  {/* Product Image & Badges - aspect-4/3 displays the entire plate without digital zoom */}
                  <div className="relative aspect-4/3 w-full bg-neutral-950 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Status Overlay if Discontinued */}
                    {isDiscontinued && (
                      <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center">
                        <span className="bg-red-500/90 text-white font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                          Discontinuado / Agotado
                        </span>
                      </div>
                    )}

                    {/* Featured Badge */}
                    {!isDiscontinued && product.isFeatured && (
                      <div className="absolute top-2.5 left-2.5 bg-amber-500 text-neutral-950 font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <Sparkles className="w-3.5 h-3.5" />
                        Destacado
                      </div>
                    )}

                    {/* Price Type & Modifier Badges */}
                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                      {product.priceType === 'variants' && !isDiscontinued && (
                        <div className="bg-neutral-950/85 backdrop-blur-sm text-neutral-300 text-xs font-medium px-2.5 py-0.5 rounded-md border border-neutral-700">
                          Con opciones
                        </div>
                      )}
                      {product.modifierGroupIds && product.modifierGroupIds.length > 0 && !isDiscontinued && (
                        <div className="bg-blue-950/85 backdrop-blur-sm text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-md border border-blue-800/80 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-blue-400" />
                          Salsas / Extras
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-lg sm:text-xl text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-sm text-neutral-300 mt-2 line-clamp-3 leading-relaxed font-normal">
                        {product.description}
                      </p>
                    </div>

                    {/* Bottom Price & Action */}
                    <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-neutral-400 block font-medium">Precio</span>
                        <span className="text-lg sm:text-xl font-black text-amber-400">
                          {getProductPriceLabel(product)}
                        </span>
                      </div>

                      {!isDiscontinued ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProduct(product);
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-200 text-sm font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>
                            {product.priceType === 'variants'
                              ? 'Opciones'
                              : product.modifierGroupIds && product.modifierGroupIds.length > 0
                              ? 'Personalizar'
                              : 'Pedir'}
                          </span>
                        </button>
                      ) : (
                        <span className="text-sm text-neutral-500 font-medium">Agotado</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Cart Trigger on Mobile / Bottom */}
      {cartCount > 0 && (
        <div className="fixed bottom-4 inset-x-4 max-w-md mx-auto z-40">
          <button
            id="btn-floating-cart"
            onClick={onOpenCart}
            className="w-full py-3.5 px-5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-2xl shadow-2xl shadow-amber-500/30 flex items-center justify-between transition-transform active:scale-98 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-neutral-950 text-white flex items-center justify-center text-xs font-black">
                {cartCount}
              </div>
              <span className="text-sm">Ver Pedido Actual</span>
            </div>

            <span className="text-base font-black">
              {formatPrice(cartTotal, business.currency)}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
