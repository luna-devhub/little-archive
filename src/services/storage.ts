import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

// Base directory for app images
const IMAGES_DIR = `${FileSystem.documentDirectory}images/`;

// Ensure the images directory exists
const ensureDirectoryExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(IMAGES_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(IMAGES_DIR, { intermediates: true });
  }
};

// Generate a unique filename
const generateFilename = (prefix: string = 'img') => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}.jpg`;
};

export const storageService = {
  /**
   * Save an image to local storage
   * @param uri - The source URI of the image (from camera or image picker)
   * @param prefix - Optional prefix for the filename
   * @returns The local file path of the saved image
   */
  async saveImage(uri: string, prefix: string = 'img'): Promise<string> {
    await ensureDirectoryExists();

    const filename = generateFilename(prefix);
    const destination = `${IMAGES_DIR}${filename}`;

    // Copy the file to our app's directory
    await FileSystem.copyAsync({
      from: uri,
      to: destination,
    });

    return destination;
  },

  /**
   * Save a base64 image to local storage
   * @param base64 - The base64 encoded image data
   * @param prefix - Optional prefix for the filename
   * @returns The local file path of the saved image
   */
  async saveBase64Image(base64: string, prefix: string = 'img'): Promise<string> {
    await ensureDirectoryExists();

    const filename = generateFilename(prefix);
    const destination = `${IMAGES_DIR}${filename}`;

    await FileSystem.writeAsStringAsync(destination, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return destination;
  },

  /**
   * Delete an image from local storage
   * @param uri - The local file path of the image to delete
   */
  async deleteImage(uri: string): Promise<void> {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(uri);
    }
  },

  /**
   * Get the local URI for display
   * @param uri - The stored URI
   * @returns The URI formatted for display in an Image component
   */
  getDisplayUri(uri: string): string {
    // On iOS, file:// prefix is needed
    // On Android, the raw path works
    if (Platform.OS === 'ios' && !uri.startsWith('file://')) {
      return `file://${uri}`;
    }
    return uri;
  },

  /**
   * Check if an image exists
   * @param uri - The local file path to check
   * @returns Whether the file exists
   */
  async imageExists(uri: string): Promise<boolean> {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    return fileInfo.exists;
  },

  /**
   * Get all saved images
   * @returns Array of image file paths
   */
  async getAllImages(): Promise<string[]> {
    await ensureDirectoryExists();

    const files = await FileSystem.readDirectoryAsync(IMAGES_DIR);
    return files.map((file: string) => `${IMAGES_DIR}${file}`);
  },

  /**
   * Clear all saved images
   */
  async clearAllImages(): Promise<void> {
    const dirInfo = await FileSystem.getInfoAsync(IMAGES_DIR);
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(IMAGES_DIR);
      await ensureDirectoryExists();
    }
  },
};
