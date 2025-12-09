/**
 * Local Storage Adapter
 *
 * Infrastructure adapter for local storage operations
 * Follows SOLID, DRY, KISS principles
 * Single Responsibility: Local storage abstraction
 */

export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

export class LocalStorageAdapter implements StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn("LocalStorageAdapter: Failed to get item", error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn("LocalStorageAdapter: Failed to set item", error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("LocalStorageAdapter: Failed to remove item", error);
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.clear();
    } catch (error) {
      console.warn("LocalStorageAdapter: Failed to clear storage", error);
    }
  }
}
