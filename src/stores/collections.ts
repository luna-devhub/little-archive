import { create } from 'zustand';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuthStore } from './auth';

export interface Collection {
  id: string;
  userId: string;
  name: string;
  icon: string;
  createdAt: Date;
  order: number;
  itemCount?: number;
}

interface CollectionsState {
  collections: Collection[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCollections: () => Promise<void>;
  createCollection: (name: string, icon: string) => Promise<string>;
  updateCollection: (id: string, data: Partial<Pick<Collection, 'name' | 'icon' | 'order'>>) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  refreshItemCount: (collectionId: string) => Promise<void>;
  clearError: () => void;
}

export const useCollectionsStore = create<CollectionsState>((set, get) => ({
  collections: [],
  isLoading: false,
  error: null,

  fetchCollections: async () => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;

      if (!user) {
        set({ collections: [], isLoading: false });
        return;
      }

      const q = query(
        collection(db, 'collections'),
        where('userId', '==', user.uid)
      );

      const querySnapshot = await getDocs(q);
      const collections: Collection[] = [];

      // Fetch item counts for all collections
      const itemsQuery = query(
        collection(db, 'items'),
        where('userId', '==', user.uid)
      );
      const itemsSnapshot = await getDocs(itemsQuery);
      const itemCounts: Record<string, number> = {};

      itemsSnapshot.forEach((doc) => {
        const data = doc.data();
        const collectionId = data.collectionId;
        itemCounts[collectionId] = (itemCounts[collectionId] || 0) + 1;
      });

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        collections.push({
          id: doc.id,
          userId: data.userId,
          name: data.name,
          icon: data.icon,
          createdAt: data.createdAt?.toDate() || new Date(),
          order: data.order || 0,
          itemCount: itemCounts[doc.id] || 0,
        });
      });

      // Sort by order ascending (avoids needing composite index)
      collections.sort((a, b) => a.order - b.order);

      set({ collections, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching collections:', error);
      set({ error: 'Failed to load collections', isLoading: false });
    }
  },

  createCollection: async (name: string, icon: string) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;

      if (!user) {
        throw new Error('User not authenticated');
      }

      const collections = get().collections;
      const maxOrder = collections.reduce((max, col) => Math.max(max, col.order), 0);

      const docRef = await addDoc(collection(db, 'collections'), {
        userId: user.uid,
        name,
        icon,
        createdAt: Timestamp.now(),
        order: maxOrder + 1,
      });

      const newCollection: Collection = {
        id: docRef.id,
        userId: user.uid,
        name,
        icon,
        createdAt: new Date(),
        order: maxOrder + 1,
      };

      set((state) => ({
        collections: [...state.collections, newCollection],
        isLoading: false,
      }));

      return docRef.id;
    } catch (error: any) {
      console.error('Error creating collection:', error);
      set({ error: 'Failed to create collection', isLoading: false });
      throw error;
    }
  },

  updateCollection: async (id: string, data: Partial<Pick<Collection, 'name' | 'icon' | 'order'>>) => {
    try {
      set({ isLoading: true, error: null });

      const docRef = doc(db, 'collections', id);
      await updateDoc(docRef, data);

      set((state) => ({
        collections: state.collections.map((col) =>
          col.id === id ? { ...col, ...data } : col
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Error updating collection:', error);
      set({ error: 'Failed to update collection', isLoading: false });
      throw error;
    }
  },

  deleteCollection: async (id: string) => {
    try {
      set({ isLoading: true, error: null });

      const docRef = doc(db, 'collections', id);
      await deleteDoc(docRef);

      set((state) => ({
        collections: state.collections.filter((col) => col.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Error deleting collection:', error);
      set({ error: 'Failed to delete collection', isLoading: false });
      throw error;
    }
  },

  refreshItemCount: async (collectionId: string) => {
    try {
      const user = useAuthStore.getState().user;
      if (!user) return;

      const q = query(
        collection(db, 'items'),
        where('userId', '==', user.uid),
        where('collectionId', '==', collectionId)
      );

      const querySnapshot = await getDocs(q);
      const count = querySnapshot.size;

      set((state) => ({
        collections: state.collections.map((col) =>
          col.id === collectionId ? { ...col, itemCount: count } : col
        ),
      }));
    } catch (error: any) {
      console.error('Error refreshing item count:', error);
    }
  },

  clearError: () => set({ error: null }),
}));
