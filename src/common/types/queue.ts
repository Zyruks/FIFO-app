export interface QueueItem {
  /**
   * The unique identifier of the queue item.
   */
  id: string;

  /**
   * The name of the queue item.
   */
  name: string;
}

export interface QueueProvider {
  /**
   * Retrieves the current queue.
   *
   * @returns A promise that resolves to an array of
   *   QueueItem.
   */
  getQueue(): Promise<Array<QueueItem>>;

  /**
   * Sets the queue with the provided items.
   *
   * @param items - The array of QueueItem to set.
   * @returns A promise that resolves when the queue is set.
   */
  setQueue(items: Array<QueueItem>): Promise<void>;

  /**
   * Subscribes to real-time updates of the queue.
   *
   * @param callback - Function to call when the queue
   *   updates.
   * @returns A function to unsubscribe from updates.
   */
  subscribe(callback: (items: Array<QueueItem>) => void): () => void;
}
