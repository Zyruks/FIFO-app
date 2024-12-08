import { QueueItem, QueueProvider } from '@common';

/**
 * Abstract base class for queue providers implementing
 * common functionality and defining the required interface
 * for concrete providers.
 */
export abstract class BaseQueueProvider implements QueueProvider {
  protected updating = false;

  abstract getQueue(): Promise<Array<QueueItem>>;
  abstract setQueue(items: Array<QueueItem>): Promise<void>;

  /**
   * Validates and filters an unknown data structure to
   * ensure it contains valid QueueItems.
   *
   * @param items - The data structure to validate.
   * @returns An array of valid QueueItems.
   */
  protected validateQueueItems(items: unknown): Array<QueueItem> {
    if (!Array.isArray(items)) return [];

    return items.filter((item) => item && typeof item === 'object' && 'id' in item && 'name' in item);
  }

  /**
   * Sets up real-time queue updates subscription.
   *
   * @param callback - Function to call when queue updates.
   * @returns Cleanup function to remove subscription.
   */
  subscribe(callback: (items: Array<QueueItem>) => void): () => void {
    const handleUpdate = async () => {
      if (this.updating) return;
      try {
        const items = await this.getQueue();
        callback(items);
      } catch (error) {
        console.warn('Error in subscription update:', error);
      }
    };

    // Initial state
    handleUpdate();

    // Provider-specific subscription setup
    return this.setupSubscription(handleUpdate);
  }

  protected abstract setupSubscription(handler: () => void): () => void;
}
