import { useEffect, useState } from 'react';
import { db } from '@api';
import { useAuth, useLocalStorage } from '@common';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';

interface QueueItem {
  /**
   * The unique identifier of the queue item.
   */
  id: string;

  /**
   * The name of the queue item.
   */
  name: string;
}

export const useQueue = () => {
  const { currentUser } = useAuth();
  const [queue, setQueue] = useState<Array<QueueItem>>([]);
  const [queueLocal, setQueueLocal] = useLocalStorage<Array<QueueItem>>('queue_guest', []);
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    setHasFetchedData(false);
    setIsLoading(true);

    if (currentUser) {
      setIsFetchingData(true);
      const queueDocRef = doc(db, 'queues', currentUser.uid);

      const fetchData = async () => {
        try {
          const docSnapshot = await getDoc(queueDocRef);
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            if (data && data.items) {
              let itemsArray: Array<QueueItem> = [];

              if (Array.isArray(data.items)) {
                itemsArray = data.items;
              } else if (typeof data.items === 'object') {
                itemsArray = Object.values(data.items);
              }

              setQueue(itemsArray);
            } else {
              setQueue([]);
            }
          } else {
            await setDoc(queueDocRef, { items: [] });
            setQueue([]);
          }

          setHasFetchedData(true);
          setIsFetchingData(false);
          setIsLoading(false);

          unsubscribe = onSnapshot(queueDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
              const data = docSnapshot.data();
              if (data && data.items) {
                let itemsArray: Array<QueueItem> = [];

                if (Array.isArray(data.items)) {
                  itemsArray = data.items;
                } else if (typeof data.items === 'object') {
                  itemsArray = Object.values(data.items);
                }

                setQueue(itemsArray);
              } else {
                setQueue([]);
              }
            } else {
              setQueue([]);
            }
          });
        } catch (error) {
          console.error('Error fetching Firestore document:', error);
          setHasFetchedData(true);
          setIsFetchingData(false);
          setIsLoading(false);
        }
      };

      fetchData();
    } else if (currentUser === null) {
      // User is not logged in
      setQueue(queueLocal);
      setHasFetchedData(true);
      setIsLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && hasFetchedData && !isFetchingData) {
      const queueDocRef = doc(db, 'queues', currentUser.uid);

      const timeoutId = setTimeout(() => {
        setDoc(queueDocRef, { items: queue }).catch((error) => {
          console.error('Error updating queue data:', error);
        });
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [queue, currentUser, hasFetchedData, isFetchingData]);

  useEffect(() => {
    if (currentUser === null && hasFetchedData) {
      setQueueLocal(queue);
    }
  }, [queue, currentUser, hasFetchedData]);

  return { queue, setQueue, isLoading };
};
