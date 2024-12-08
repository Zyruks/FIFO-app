import { db } from '@api';
import { QueueItem, QueueProvider } from '@common';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';

export class FirebaseQueueProvider implements QueueProvider {
  private userId: string;

  /**
   * Initializes the FirebaseQueueProvider with the current
   * user's ID.
   *
   * @param userId - The UID of the current user.
   */
  constructor(userId: string) {
    this.userId = userId;
  }

  /**
   * Retrieves the current queue from Firestore.
   *
   * @returns A promise that resolves to an array of
   *   QueueItem.
   */
  async getQueue(): Promise<Array<QueueItem>> {
    const queueDocRef = doc(db, 'queues', this.userId);
    const docSnapshot = await getDoc(queueDocRef);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      if (data && data.items) {
        return Array.isArray(data.items) ? data.items : Object.values(data.items);
      }
    }

    // Initialize the queue document if it doesn't exist
    await setDoc(queueDocRef, { items: [] });
    return [];
  }

  /**
   * Sets the queue in Firestore.
   *
   * @param items - The array of QueueItem to set.
   */
  async setQueue(items: Array<QueueItem>): Promise<void> {
    const queueDocRef = doc(db, 'queues', this.userId);
    await setDoc(queueDocRef, { items });
  }

  /**
   * Subscribes to real-time updates of the queue in
   * Firestore.
   *
   * @param callback - Function to call when the queue
   *   updates.
   * @returns A function to unsubscribe from updates.
   */
  subscribe(callback: (items: Array<QueueItem>) => void): () => void {
    const queueDocRef = doc(db, 'queues', this.userId);
    return onSnapshot(queueDocRef, (docSnapshot) => {
      if (!docSnapshot.exists()) {
        callback([]);
        return;
      }

      const data = docSnapshot.data();
      let items: Array<QueueItem> = [];

      if (data && data.items) {
        if (Array.isArray(data.items)) items = data.items;
        else items = Object.values(data.items);
      }

      callback(items);
    });
  }
}
