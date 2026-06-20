import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const QUEUE_KEY = 'offline_queue';

interface QueueItem {
  id: string;
  type: 'create_item' | 'update_item' | 'delete_item';
  data: any;
  timestamp: number;
}

/**
 * Add an item to the offline queue
 */
export async function addToQueue(item: Omit<QueueItem, 'id' | 'timestamp'>): Promise<void> {
  try {
    const queue = await getQueue();
    const newItem: QueueItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    queue.push(newItem);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Error adding to queue:', error);
  }
}

/**
 * Get all items in the queue
 */
export async function getQueue(): Promise<QueueItem[]> {
  try {
    const queueStr = await AsyncStorage.getItem(QUEUE_KEY);
    return queueStr ? JSON.parse(queueStr) : [];
  } catch (error) {
    console.error('Error getting queue:', error);
    return [];
  }
}

/**
 * Clear the queue
 */
export async function clearQueue(): Promise<void> {
  try {
    await AsyncStorage.removeItem(QUEUE_KEY);
  } catch (error) {
    console.error('Error clearing queue:', error);
  }
}

/**
 * Remove an item from the queue
 */
export async function removeFromQueue(id: string): Promise<void> {
  try {
    const queue = await getQueue();
    const filtered = queue.filter(item => item.id !== id);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing from queue:', error);
  }
}

/**
 * Check if the device is online
 */
export async function isOnline(): Promise<boolean> {
  try {
    const netInfo = await NetInfo.fetch();
    return netInfo.isConnected ?? false;
  } catch (error) {
    console.error('Error checking network:', error);
    return false;
  }
}

/**
 * Process the queue when online
 */
export async function processQueue(processor: (item: QueueItem) => Promise<void>): Promise<void> {
  const online = await isOnline();
  if (!online) return;

  const queue = await getQueue();
  if (queue.length === 0) return;

  for (const item of queue) {
    try {
      await processor(item);
      await removeFromQueue(item.id);
    } catch (error) {
      console.error('Error processing queue item:', error);
      // Keep item in queue for retry
    }
  }
}
