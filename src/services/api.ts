import { MenuData } from '../types';
import { INITIAL_MENU_DATA } from '../initialData';

const STORAGE_KEY = 'digital_menu_cached_data_v1';

export async function fetchMenuData(): Promise<MenuData> {
  try {
    const response = await fetch('/api/menu');
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    }
  } catch (error) {
    console.warn('Could not fetch from server API, attempting local fallback:', error);
  }

  // Fallback to local storage
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }

  return INITIAL_MENU_DATA;
}

export async function saveMenuDataToServer(data: MenuData): Promise<boolean> {
  // Always update local cache immediately for fast UI
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  try {
    const response = await fetch('/api/menu', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to sync to server:', error);
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
