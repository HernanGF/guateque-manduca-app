import { useState, useEffect, useCallback } from 'react';
import { MenuData, Product, CartItem, SelectedModifier } from './types';
import { INITIAL_MENU_DATA } from './initialData';
import { fetchMenuData, saveMenuDataToServer, resetMenuData } from './services/api';
import { WelcomeScreen } from './components/WelcomeScreen';
import { PublicMenu } from './components/PublicMenu';
import { ProductCustomizerModal } from './components/ProductCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminPinModal } from './components/AdminPinModal';

export default function App() {
  const [currentView, setCurrentView] = useState<'welcome' | 'menu' | 'admin'>('welcome');
  const [menuData, setMenuData] = useState<MenuData>(INITIAL_MENU_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Security / Admin PIN state
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Customizer modal state
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);

  // Load menu data from cloud server on start
  useEffect(() => {
    let isMounted = true;
    async function load() {
      setIsLoading(true);
      const data = await fetchMenuData();
      if (isMounted) {
        setMenuData(data);
        setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Update Menu Data & sync to server
  const handleUpdateMenuData = useCallback(async (newData: MenuData) => {
    setMenuData(newData);
    await saveMenuDataToServer(newData);
  }, []);

  const handleResetData = useCallback(async () => {
    setIsLoading(true);
    const data = await resetMenuData();
    setMenuData(data);
    setIsLoading(false);
  }, []);

  // Cart actions
  const handleAddToCart = (customizedItem: {
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
  }) => {
    const newItem: CartItem = {
      id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...customizedItem,
    };

    setCartItems((prev) => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const ratio = newQty / item.quantity;
          const updatedTotal = item.unitPrice * newQty;
          return {
            ...item,
            quantity: newQty,
            itemTotal: updatedTotal,
          };
        }
        return item;
      })
    );
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Admin access with 4-digit PIN (1151)
  const handleOpenAdmin = () => {
    if (isAdminUnlocked) {
      setCurrentView('admin');
    } else {
      setIsPinModalOpen(true);
    }
  };

  const handlePinSuccess = () => {
    setIsAdminUnlocked(true);
    setIsPinModalOpen(false);
    setCurrentView('admin');
  };

  const handleLockAdmin = () => {
    setIsAdminUnlocked(false);
    setCurrentView('menu');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.itemTotal, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-neutral-400 font-medium tracking-wide">
          Cargando menú en la nube...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* 1. Welcome & Presentation Screen */}
      {currentView === 'welcome' && (
        <WelcomeScreen
          business={menuData.business}
          onEnterMenu={() => setCurrentView('menu')}
          onOpenAdmin={handleOpenAdmin}
        />
      )}

      {/* 2. Public Interactive Menu Screen */}
      {currentView === 'menu' && (
        <PublicMenu
          menuData={menuData}
          cartCount={cartCount}
          cartTotal={cartTotal}
          onOpenCart={() => setIsCartOpen(true)}
          onSelectProduct={(product) => setCustomizingProduct(product)}
          onBackToWelcome={() => setCurrentView('welcome')}
          onOpenAdmin={handleOpenAdmin}
        />
      )}

      {/* 3. Admin / Management Dashboard */}
      {currentView === 'admin' && (
        <AdminDashboard
          menuData={menuData}
          onUpdateMenuData={handleUpdateMenuData}
          onBackToMenu={() => setCurrentView('menu')}
          onResetData={handleResetData}
          onLockAdmin={handleLockAdmin}
        />
      )}

      {/* Admin PIN Security Modal */}
      <AdminPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handlePinSuccess}
      />

      {/* Product Customizer Modal */}
      {customizingProduct && (
        <ProductCustomizerModal
          product={customizingProduct}
          modifierGroups={menuData.modifierGroups}
          currency={menuData.business.currency}
          onClose={() => setCustomizingProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        business={menuData.business}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
