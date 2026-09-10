import { MenuData } from '../types';
import { INITIAL_MENU_DATA } from '../initialData';

const STORAGE_KEY = 'guateque_menu_cached_data';

export async function fetchMenuData(): Promise<MenuData> {
  // 1. Try to fetch from server API (runs when dev server or backend is active)
  try {
    const response = await fetch('/api/menu');
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
    // Expected on static hosting like Vercel
  }

  // 2. On static hosting (like Vercel), compare local storage timestamp with deployed data
  const initialTimestamp = INITIAL_MENU_DATA.updatedAt || 0;

  try {
    const cachedRaw = localStorage.getItem(STORAGE_KEY);
    if (cachedRaw) {
      const cached: MenuData = JSON.parse(cachedRaw);
      const cachedTimestamp = cached.updatedAt || 0;

      // If cached data is strictly newer than the deployed code build (e.g. unpublished admin test in this browser),
      // we use it. Otherwise, the fresh deployment always takes precedence!
      if (
        cachedTimestamp > initialTimestamp &&
        Array.isArray(cached.products) &&
        Array.isArray(cached.modifierGroups)
      ) {
        return cached;
      }
    }
  } catch {
    // ignore
  }

  // 3. Fallback to latest compiled code (INITIAL_MENU_DATA).
  // Automatically update localStorage with the new build so the browser stays completely fresh!
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MENU_DATA));
  } catch {
    // ignore
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
