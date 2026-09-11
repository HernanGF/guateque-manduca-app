import { Product } from '../types';

/**
 * Returns the effective display order of a product in a given category.
 * If a category-specific order is defined, it takes precedence.
 * Otherwise, falls back to the default product order.
 */
export function getProductOrder(product: Product, categoryId?: string): number {
  if (
    categoryId &&
    categoryId !== 'all' &&
    product.categoryOrders &&
    product.categoryOrders[categoryId] !== undefined
  ) {
    return product.categoryOrders[categoryId];
  }
  return product.order ?? 9999;
}

/**
 * Sorts an array of products by their order within a specific category.
 */
export function sortProductsByOrder(
  products: Product[],
  categoryId?: string
): Product[] {
  return [...products].sort((a, b) => {
    const orderA = getProductOrder(a, categoryId);
    const orderB = getProductOrder(b, categoryId);
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return a.name.localeCompare(b.name);
  });
}

/**
 * Re-indexes a list of products within a specific category according to a given sequence of product IDs.
 * Sets categoryOrders[categoryId] to 1, 2, 3...
 */
export function reorderProductsForCategory(
  allProducts: Product[],
  categoryId: string,
  orderedProductIds: string[]
): Product[] {
  const positionMap = new Map<string, number>();
  orderedProductIds.forEach((id, index) => {
    positionMap.set(id, index + 1);
  });

  return allProducts.map((p) => {
    if (positionMap.has(p.id)) {
      const newPos = positionMap.get(p.id)!;
      const updatedCategoryOrders = {
        ...(p.categoryOrders || {}),
        [categoryId]: newPos,
      };

      return {
        ...p,
        categoryOrders: updatedCategoryOrders,
        // If reordering in "all" or if product only has this category, also sync default order
        order: categoryId === 'all' ? newPos : p.order,
      };
    }
    return p;
  });
}

/**
 * Moves a product to a specific 1-based position in the category product list.
 */
export function moveProductToPosition(
  allProducts: Product[],
  categoryId: string,
  productId: string,
  targetPosition: number
): Product[] {
  // Get all products currently in this category
  const categoryProducts = allProducts.filter((p) => {
    if (categoryId === 'all') return true;
    if (categoryId === 'cat_los-mas-elegidos') {
      return p.isFeatured || (p.categoryIds && p.categoryIds.includes('cat_los-mas-elegidos'));
    }
    return p.categoryIds && p.categoryIds.includes(categoryId);
  });

  const sorted = sortProductsByOrder(categoryProducts, categoryId);
  const currentIndex = sorted.findIndex((p) => p.id === productId);
  if (currentIndex === -1) return allProducts;

  // Clamp target position to [1, sorted.length]
  const newIndex = Math.max(0, Math.min(sorted.length - 1, targetPosition - 1));

  // Reorder
  const item = sorted.splice(currentIndex, 1)[0];
  sorted.splice(newIndex, 0, item);

  const orderedIds = sorted.map((p) => p.id);
  return reorderProductsForCategory(allProducts, categoryId, orderedIds);
}
