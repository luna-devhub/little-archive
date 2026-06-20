# Little Archive

A personal mobile cataloging app where users photograph interesting objects — nature specimens, antiques, art, and handmade items — and add the description for them, and files them into a scrapbook-style collection.

## Features

- 📸 **Photo Capture** - Take photos or pick from gallery
- 📁 **Collections** - Organize items into custom collections
- 🎨 **Vintage UI** - Beautiful journal-style design
- 🔐 **Firebase Auth** - Email/password authentication
- ☁️ **Cloud Sync** - Firestore for metadata sync
- 📱 **Local Storage** - Images stored on device

## Tech Stack

- **Framework:** React Native (Expo SDK 54)
- **Navigation:** Expo Router
- **State Management:** Zustand
- **Backend:** Firebase (Auth + Firestore)
- **AI:** Google Cloud Vision API
- **Background Removal:** Remove.bg API
- **Icons:** Lucide React Native

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- Expo Go app on your phone (SDK 54)
- Firebase project

### Installation

1. Clone the repository:
   ```bash
   cd little-archive
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Add your Firebase config to `.env`

5. Start the development server:
   ```bash
   npx expo start
   ```

6. Scan QR code with Expo Go

## Project Structure

```
src/
  app/                    # Expo Router screens
    (auth)/               # Login, signup
    (tabs)/               # Main tab navigation
      index.tsx           # Home / Collections
      settings.tsx        # Settings
    collection/
      [id].tsx            # Collection detail
    item/
      [id].tsx            # Item detail
    camera.tsx            # Camera capture
    review.tsx            # Review & identify
  components/
    CollectionCard.tsx
    CollectionIcon.tsx
    CreateCollectionModal.tsx
    IconPicker.tsx
    ItemCard.tsx
  services/
    ai.ts                 # Google Vision + Remove.bg
    firebase.ts           # Firebase config
    storage.ts            # Local image storage
  stores/
    auth.ts               # Auth state
    collections.ts        # Collections state
    items.ts              # Items state
  theme/
    colors.ts
    typography.ts
    textures.ts
  utils/
    image.ts              # Image processing
    offlineQueue.ts       # Offline support
```

## Building for Production

### Android APK

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build preview APK
eas build --platform android --profile preview
```

### Android App Bundle (Play Store)

```bash
eas build --platform android --profile production
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Firebase API key |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
| `EXPO_PUBLIC_GOOGLE_CLOUD_VISION_API_KEY` | Google Cloud Vision API key |
| `EXPO_PUBLIC_REMOVE_BG_API_KEY` | Remove.bg API key |

## Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable **Authentication** → Email/Password
3. Create a **Firestore database** (start in test mode)
4. Create a **web app** and copy the config
5. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

## License

This project is licensed under the MIT License.
