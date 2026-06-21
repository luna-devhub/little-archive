# Little Archive Helper

A skill for working with the Little Archive React Native mobile app.

## When to Use

Use this skill when the user asks about:
- Adding or modifying collection features
- Working with item cards or collection cards
- Firebase/Firestore integration
- Expo Router navigation
- Theme customization (vintage/journal aesthetic)
- Zustand store patterns

## Project Context

Little Archive is a React Native (Expo SDK 54) app for cataloging physical objects. Users photograph objects and organize them into scrapbook-style collections.

### Key Architecture

- **Navigation:** Expo Router with file-based routing in `src/app/`
- **State:** Zustand stores in `src/stores/` (auth, collections, items)
- **Backend:** Firebase Auth + Firestore
- **Theme:** Vintage/journal aesthetic with custom colors (parchment, cream, amber, leather, ink)

### Common Patterns

- All screens use `useRouter()` from Expo Router for navigation
- Stores call Firebase SDK directly and expose data + actions
- Components use the theme from `../theme` for consistent styling
- Images stored locally; only metadata synced to Firestore

## Example Tasks

- "Add a new field to the item model"
- "Create a new collection sort option"
- "Update the item card layout"
- "Add a search feature to collections"
