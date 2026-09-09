export interface ModifierOption {
  id: string;
  name: string;
  price: number;
  isVisible: boolean;
}

export interface ModifierGroup {
  id: string;
  name: string;
  condition: 'required' | 'optional';
  selectionType: 'single' | 'multiple';
  minSelect?: number;
  maxSelect?: number;
  options: ModifierOption[];
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  isVisible?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  categoryIds: string[];
  priceType: 'simple' | 'variants';
  simplePrice: number;
  clientNote?: string;
  variants: ProductVariant[];
  modifierGroupIds: string[];
  isDiscontinued: boolean;
  isHidden: boolean;
  isFeatured?: boolean;
  order: number;
}

export interface Category {
  id: string;
  name: string;
  order: number;
  isVisible: boolean;
  isFeatured?: boolean;
}

export interface BusinessInfo {
  id: string;
  name: string;
  description: string;
  bannerUrl: string;
  logoUrl: string;
  whatsappPhone: string;
  address: string;
  hours: string;
  currency: string;
  deliveryAvailable: boolean;
  takeawayAvailable: boolean;
}

export interface MenuData {
  business: BusinessInfo;
  categories: Category[];
  products: Product[];
  modifierGroups: ModifierGroup[];
}

export interface SelectedModifier {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  price: number;
  quantity: number;
}

export interface CartItem {
  id: string;
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
}

export interface OrderCustomerInfo {
  customerName: string;
  orderType: 'delivery' | 'takeaway';
  address: string;
  paymentMethod: 'efectivo' | 'transferencia' | 'tarjeta' | 'otro';
  notes: string;
}
