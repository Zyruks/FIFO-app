import { BaseQueueProvider } from './BaseQueueProvider';
import { QueueItem } from '@common';

/**
 * Queue provider implementation using localStorage for
 * guest users. Handles queue persistence and real-time
 * updates through localStorage events.
 */
export class LocalStorageQueueProvider extends BaseQueueProvider {
  private storageKey: string;

  /**
   * Initializes the LocalStorageQueueProvider with a
   * specific storage key.
   *
   * @param storageKey - The key used to store queue data in
   *   localStorage.
   */
  constructor(storageKey: string) {
    super();
    this.storageKey = storageKey;
  }

  /**
   * Retrieves the current queue from localStorage.
   *
   * @returns A promise that resolves to an array of
   *   QueueItem.
   */
  async getQueue(): Promise<Array<QueueItem>> {
    try {
      const item = window.localStorage.getItem(this.storageKey);
      if (!item) return [];

      const parsed = JSON.parse(item);
      return this.validateQueueItems(parsed);
    } catch (error) {
      console.warn(`Error reading localStorage key "${this.storageKey}":`, error);
      return [];
    }
  }

  /**
   * Saves the queue to localStorage and triggers update
   * events.
   *
   * @param items - The array of QueueItem to save.
   */
  async setQueue(items: Array<QueueItem>): Promise<void> {
    try {
      this.updating = true;
      window.localStorage.setItem(this.storageKey, JSON.stringify(items));
      window.dispatchEvent(new CustomEvent('local-storage'));
    } catch (error) {
      console.warn(`Error setting localStorage key "${this.storageKey}":`, error);
    } finally {
      this.updating = false;
    }
  }

  protected setupSubscription(handler: () => void): () => void {
    window.addEventListener('storage', handler);
    window.addEventListener('local-storage', handler);

    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('local-storage', handler);
    };
  }
}
