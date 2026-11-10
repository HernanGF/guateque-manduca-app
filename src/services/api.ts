import { MenuData } from '../types';
import { INITIAL_MENU_DATA } from '../initialData';

const STORAGE_KEY = 'guateque_menu_cached_data';

export async function fetchMenuData(): Promise<MenuData> {
  // 1. Try to fetch from server API (runs when dev server or backend is active)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const response = await fetch('/api/menu', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (response.ok) {
      const data: MenuData = await response.json();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        // ignore
      }
      return data;
    }
  } catch {
    // Expected on static hosting like Vercel or when network is slow
  }

  // 2. Fallback on static hosting or offline:
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
  }

  return INITIAL_MENU_DATA;
}

export async function saveMenuDataToServer(data: MenuData): Promise<boolean> {
  const dataWithTimestamp: MenuData = {
    ...data,
    updatedAt: Date.now(),
  };

  // Keep local cache updated
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataWithTimestamp));
  } catch {
    // ignore
  }

  try {
    const response = await fetch('/api/menu', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataWithTimestamp),
    });
    return response.ok;
  } catch (error) {
    console.warn('Could not sync to server (static hosting mode):', error);
    return false;
  }
}

export async function resetMenuData(): Promise<MenuData> {
  try {
    const response = await fetch('/api/reset', { method: 'POST' });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    }
  } catch (error) {
    console.error('Failed to reset on server:', error);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MENU_DATA));
  return INITIAL_MENU_DATA;
}
