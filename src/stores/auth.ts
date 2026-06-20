import { create } from 'zustand';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../services/firebase';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateDisplayName: (displayName: string) => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
  initialize: () => () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,

  signUp: async (email: string, password: string, displayName: string) => {
    try {
      set({ isLoading: true, error: null });
      console.log('Attempting signup with:', { email, displayName });

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Signup successful:', userCredential.user.uid);

      // Update the user's display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }

      set({
        user: userCredential.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      let errorMessage = 'Failed to create account';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/Password authentication is not enabled in Firebase';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Check your internet connection.';
          break;
        default:
          errorMessage = error.message || 'Failed to create account';
      }

      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      set({
        user: userCredential.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      let errorMessage = 'Failed to sign in';

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later';
          break;
      }

      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      await signOut(auth);

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: 'Failed to sign out', isLoading: false });
      throw new Error('Failed to sign out');
    }
  },

  resetPassword: async (email: string) => {
    try {
      set({ isLoading: true, error: null });
      await sendPasswordResetEmail(auth, email);
      set({ isLoading: false });
    } catch (error: any) {
      let errorMessage = 'Failed to send reset email';

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
      }

      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  updateDisplayName: async (displayName: string) => {
    try {
      set({ isLoading: true, error: null });
      const user = auth.currentUser;

      if (user) {
        await updateProfile(user, { displayName });
        set({ user: { ...user, displayName } as User, isLoading: false });
      }
    } catch (error: any) {
      set({ error: 'Failed to update display name', isLoading: false });
      throw new Error('Failed to update display name');
    }
  },

  clearError: () => set({ error: null }),

  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  },

  initialize: () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      get().setUser(user);
    });

    return unsubscribe;
  },
}));
