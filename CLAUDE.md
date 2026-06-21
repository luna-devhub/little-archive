# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Little Archive is a React Native mobile app (Expo SDK 54) for cataloging physical objects — nature specimens, antiques, art, handmade items. Users photograph objects, the app identifies them via Google Cloud Vision API, removes backgrounds via Remove.bg, and stores them in scrapbook-style collections.

## Development Commands

```bash
# Start development server (scan QR with Expo Go)
npx expo start

# Platform-specific starts
npx expo start --android
npx expo start --ios
npx expo start --web

# Build with EAS
eas build --platform android --profile preview    # APK for testing
eas build --platform android --profile production # AAB for Play Store

# Deploy Firestore rules
firebase deploy --only firestore:rules
```

No test runner or linter is configured.

## Architecture

**Navigation:** Expo Router with file-based routing in `src/app/`. Root layout (`_layout.tsx`) handles auth gating — unauthenticated users are redirected to `(auth)/login`, authenticated users to `(tabs)`.

**Route groups:**
- `(auth)/` — login, signup screens
- `(tabs)/` — main tab navigation (home/collections, settings)
- `collection/[id]` — collection detail view
- `item/[id]` — item detail view
- `camera.tsx` — camera capture screen
- `review.tsx` — review & identify captured photo

**State management:** Zustand stores in `src/stores/` — one store per domain (auth, collections, items). Stores directly call Firebase SDK and expose both data and actions. Access current user via `useAuthStore.getState().user`.

**Services:**
- `firebase.ts` — initializes Firebase app, auth (with AsyncStorage persistence for React Native), and Firestore. Exports `auth` and `db`.
- `ai.ts` — Google Cloud Vision API (label + web detection) and Remove.bg background removal. Takes base64 images, returns identification results.
- `storage.ts` — local image file storage on device.

**Theme:** Vintage/journal aesthetic. Colors (`parchment`, `cream`, `amber`, `leather`, `ink`, `fadedInk`) and typography (PlayfairDisplay, Lora fonts) in `src/theme/`. Import from `../theme` — the index re-exports everything.

**Components:** Shared UI components in `src/components/` — CollectionCard, ItemCard, CreateCollectionModal, IconPicker, CollectionIcon. Barrel export via `src/components/index.ts`.

## Key Patterns

- All Firebase config and API keys come from `EXPO_PUBLIC_*` environment variables (see `.env`).
- Firebase auth uses `getReactNativePersistence(AsyncStorage)` with fallback to default auth.
- Firestore queries filter by `userId` for security — client-side filtering matches the server-side rules.
- Images are stored locally on device; only metadata syncs to Firestore.
- Collections have an `order` field for manual sorting (sorted client-side to avoid composite indexes).
- The app uses `expo-router/entry` as the entry point (`index.ts`), not `App.tsx` directly.

## Environment Variables

Required in `.env`:
- `EXPO_PUBLIC_FIREBASE_*` — Firebase config (API key, auth domain, project ID, storage bucket, messaging sender ID, app ID)
- `EXPO_PUBLIC_GOOGLE_CLOUD_VISION_API_KEY` — Google Cloud Vision
- `EXPO_PUBLIC_REMOVE_BG_API_KEY` — Remove.bg

## Build Configuration

EAS profiles in `eas.json`: `development` (debug APK), `preview` (internal APK), `production` (AAB). All profiles inject env vars from the shell. Requires EAS CLI v12+.
