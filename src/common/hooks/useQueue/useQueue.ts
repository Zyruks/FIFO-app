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
      // User is authenticated, fetch their queue from Firestore
      setIsFetchingData(true);
      const queueDocRef = doc(db, 'queues', currentUser.uid);

      const fetchData = async () => {
        try {
          // Retrieve the queue document from Firestore
          const docSnapshot = await getDoc(queueDocRef);
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            if (data && data.items) {
              let itemsArray: Array<QueueItem> = [];

              // Check if 'items' is an array or an object and convert accordingly
              if (Array.isArray(data.items)) {
                itemsArray = data.items;
              } else if (typeof data.items === 'object') {
                itemsArray = Object.values(data.items);
              }

              setQueue(itemsArray);
            } else {
              // If 'items' field is missing, initialize with an empty array
              setQueue([]);
            }
          } else {
            // If the document does not exist, create it with an empty 'items' array
            await setDoc(queueDocRef, { items: [] });
            setQueue([]);
          }

          // Update state to reflect that data has been fetched
          setHasFetchedData(true);
          setIsFetchingData(false);
          setIsLoading(false);

          // Set up a real-time listener for changes in the queue document
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
          // Handle any errors that occur during data fetching
          console.error('Error fetching Firestore document:', error);
          setHasFetchedData(true);
          setIsFetchingData(false);
          setIsLoading(false);
        }
      };

      fetchData();
    } else if (currentUser === null) {
      // User is not authenticated, use the local queue from localStorage
      setQueue(queueLocal);
      setHasFetchedData(true);
      setIsLoading(false);
    }

    // Cleanup function to unsubscribe from Firestore listener when component unmounts or currentUser changes
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && hasFetchedData && !isFetchingData) {
      const queueDocRef = doc(db, 'queues', currentUser.uid);

      // Debounce the update to Firestore by 500ms to prevent excessive writes
      const timeoutId = setTimeout(() => {
        setDoc(queueDocRef, { items: queue }).catch((error) => {
          // Handle any errors that occur during the update
          console.error('Error updating queue data:', error);
        });
      }, 500);

      // Cleanup the timeout if the effect runs again before the timeout completes
      return () => clearTimeout(timeoutId);
    }
  }, [queue, currentUser, hasFetchedData, isFetchingData]);

  useEffect(() => {
    if (currentUser === null && hasFetchedData) {
      // If the user logs out, save the current queue to localStorage
      setQueueLocal(queue);
    }
  }, [queue, currentUser, hasFetchedData]);

  return { queue, setQueue, isLoading };
};
