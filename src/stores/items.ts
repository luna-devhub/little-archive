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
import { storageService } from '../services/storage';
import { useCollectionsStore } from './collections';

export interface Item {
  id: string;
  userId: string;
  collectionId: string;
  originalPhotoUri: string;
  croppedPhotoUri?: string;
  useCropped: boolean;
  name: string;
  description: string;
  funFacts: string;
  createdAt: Date;
  editedAt?: Date;
}

interface ItemsState {
  items: Item[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchItems: (collectionId: string) => Promise<void>;
  createItem: (data: Omit<Item, 'id' | 'userId' | 'createdAt'>) => Promise<string>;
  updateItem: (id: string, data: Partial<Pick<Item, 'name' | 'description' | 'funFacts' | 'useCropped' | 'croppedPhotoUri'>>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useItemsStore = create<ItemsState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async (collectionId: string) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;

      if (!user) {
        set({ items: [], isLoading: false });
        return;
      }

      const q = query(
        collection(db, 'items'),
        where('userId', '==', user.uid),
        where('collectionId', '==', collectionId)
      );

      const querySnapshot = await getDocs(q);
      const items: Item[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          userId: data.userId,
          collectionId: data.collectionId,
          originalPhotoUri: data.originalPhotoUri,
          croppedPhotoUri: data.croppedPhotoUri,
          useCropped: data.useCropped || false,
          name: data.name,
          description: data.description || '',
          funFacts: data.funFacts || '',
          createdAt: data.createdAt?.toDate() || new Date(),
          editedAt: data.editedAt?.toDate(),
        });
      });

      // Sort by createdAt descending (avoids needing composite index)
      items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      set({ items, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching items:', error);
      set({ error: 'Failed to load items', isLoading: false });
    }
  },

  createItem: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const user = useAuthStore.getState().user;

      if (!user) {
        throw new Error('User not authenticated');
      }

      const docRef = await addDoc(collection(db, 'items'), {
        userId: user.uid,
        collectionId: data.collectionId,
        originalPhotoUri: data.originalPhotoUri,
        croppedPhotoUri: data.croppedPhotoUri || null,
        useCropped: data.useCropped || false,
        name: data.name,
        description: data.description || '',
        funFacts: data.funFacts || '',
        createdAt: Timestamp.now(),
      });

      const newItem: Item = {
        id: docRef.id,
        userId: user.uid,
        collectionId: data.collectionId,
        originalPhotoUri: data.originalPhotoUri,
        croppedPhotoUri: data.croppedPhotoUri,
        useCropped: data.useCropped || false,
        name: data.name,
        description: data.description || '',
        funFacts: data.funFacts || '',
        createdAt: new Date(),
      };

      set((state) => ({
        items: [newItem, ...state.items],
        isLoading: false,
      }));

      // Refresh the collection's item count
      await useCollectionsStore.getState().refreshItemCount(data.collectionId);

      return docRef.id;
    } catch (error: any) {
      console.error('Error creating item:', error);
      set({ error: 'Failed to create item', isLoading: false });
      throw error;
    }
  },

  updateItem: async (id: string, data) => {
    try {
      set({ isLoading: true, error: null });

      const docRef = doc(db, 'items', id);
      await updateDoc(docRef, {
        ...data,
        editedAt: Timestamp.now(),
      });

      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, ...data, editedAt: new Date() } : item
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      console.error('Error updating item:', error);
      set({ error: 'Failed to update item', isLoading: false });
      throw error;
    }
  },

  deleteItem: async (id: string) => {
    try {
      set({ isLoading: true, error: null });

      // Get the item to delete its images
      const item = get().items.find(i => i.id === id);

      // Delete from Firestore
      const docRef = doc(db, 'items', id);
      await deleteDoc(docRef);

      // Delete local images
      if (item) {
        await storageService.deleteImage(item.originalPhotoUri);
        if (item.croppedPhotoUri) {
          await storageService.deleteImage(item.croppedPhotoUri);
        }
      }

      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        isLoading: false,
      }));

      // Refresh the collection's item count
      if (item) {
        await useCollectionsStore.getState().refreshItemCount(item.collectionId);
      }
    } catch (error: any) {
      console.error('Error deleting item:', error);
      set({ error: 'Failed to delete item', isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
