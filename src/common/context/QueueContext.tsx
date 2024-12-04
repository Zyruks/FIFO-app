import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';
import { db } from '../../api/firebase';
import { useAuth } from './AuthContext';
import { useLocalStorage } from '@common';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';

interface QueueItem {
  id: string;
  name: string;
}

interface QueueContextType {
  /**
   * The current queue of items.
   */
  queue: Array<QueueItem>;

  /**
   * Sets the current queue of items.
   */
  setQueue: Dispatch<SetStateAction<QueueItem[]>>;
}

const QueueContext = createContext<QueueContextType>({} as QueueContextType);

export const QueueProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [queueLocal, setQueueLocal] = useLocalStorage<QueueItem[]>('queue_guest', []);
  const [hasFetchedData, setHasFetchedData] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (currentUser) {
      const queueDocRef = doc(db, 'queues', currentUser.uid);

      const fetchData = async () => {
        try {
          const docSnapshot = await getDoc(queueDocRef);
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            if (data && data.items) {
              let itemsArray: QueueItem[] = [];

              if (Array.isArray(data.items)) {
                itemsArray = data.items;
              } else {
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

          unsubscribe = onSnapshot(queueDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
              const data = docSnapshot.data();
              if (data && data.items) {
                let itemsArray: QueueItem[] = [];

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
        }
      };

      fetchData();
    } else {
      setQueue(queueLocal);
      setHasFetchedData(true);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && hasFetchedData) {
      const queueDocRef = doc(db, 'queues', currentUser.uid);

      const timeoutId = setTimeout(() => {
        setDoc(queueDocRef, { items: queue }).catch((error) => {
          console.error('Error updating queue data:', error);
        });
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [queue, currentUser, hasFetchedData]);

  useEffect(() => {
    if (!currentUser && hasFetchedData) {
      setQueueLocal(queue);
    }
  }, [queue, currentUser, hasFetchedData]);

  return <QueueContext.Provider value={{ queue, setQueue }}>{children}</QueueContext.Provider>;
};

export const useQueueContext = () => {
  const context = useContext(QueueContext);
  if (!context) throw new Error('useQueueContext must be used within QueueProvider');
  return context;
};
