import { useEffect, useState } from 'react';
import { QueueItem, QueueProvider } from '../../types/queue';
import { QueueProviderFactory } from './QueueProviderFactory';
import { QueueProviderType, useAuth } from '@common';

/**
 * Custom hook for managing queue operations with support
 * for both authenticated and guest users.
 *
 * @returns Object containing queue state and management
 *   functions.
 */
export const useQueue = () => {
  const { currentUser } = useAuth();
  const [queue, setQueue] = useState<Array<QueueItem>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [provider, setProvider] = useState<QueueProvider | null>(null);

  useEffect(() => {
    const initializeNewProvider = async () => {
      const newProvider = currentUser
        ? QueueProviderFactory.createProvider(QueueProviderType.FIREBASE, { userId: currentUser.uid })
        : QueueProviderFactory.createProvider(QueueProviderType.LOCAL_STORAGE);

      const existingQueue = await newProvider.getQueue();

      // If new provider has data, use it
      // If new provider is empty but we have data in state, migrate it
      if (existingQueue.length > 0) setQueue(existingQueue);
      else if (queue.length > 0) await newProvider.setQueue(queue);

      setProvider(newProvider);
    };

    initializeNewProvider();
  }, [currentUser]);

  useEffect(() => {
    let unsubscribe: () => void;

    const initializeQueue = async () => {
      if (!provider) return;

      setIsLoading(true);
      try {
        const initialQueue = await provider.getQueue();
        // Only update queue if we have items or current queue is empty
        if (initialQueue.length > 0 || queue.length === 0) {
          setQueue(initialQueue);
        }
        setIsLoading(false);

        unsubscribe = provider.subscribe((updatedQueue) => {
          // Only update if we have items or current queue is empty
          if (updatedQueue.length > 0 || queue.length === 0) {
            setQueue(updatedQueue);
          }
        });
      } catch (error) {
        console.error('Error initializing queue:', error);
        setIsLoading(false);
      }
    };

    initializeQueue();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [provider]);

  useEffect(() => {
    if (provider) {
      let debounceTimeout: NodeJS.Timeout;

      const updateQueue = async () => {
        try {
          await provider.setQueue(queue);
        } catch (error) {
          console.error('Error updating queue:', error);
        }
      };

      if (currentUser) {
        // Debounce the update by 500ms if using Firebase
        debounceTimeout = setTimeout(updateQueue, 500);
      } else {
        // Immediate update for LocalStorage
        updateQueue();
      }

      return () => {
        if (debounceTimeout) clearTimeout(debounceTimeout);
      };
    }
  }, [queue, provider, currentUser]);

  return { queue, setQueue, isLoading };
};
