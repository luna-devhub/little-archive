import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';

/**
 * Convert an image URI to base64
 * @param uri - Local file URI
 * @returns Base64 encoded string
 */
export async function imageToBase64(uri: string): Promise<string> {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw new Error('Failed to convert image to base64');
  }
}

/**
 * Resize an image for upload
 * @param uri - Local file URI
 * @param maxWidth - Maximum width (default: 1024)
 * @param maxHeight - Maximum height (default: 1024)
 * @param quality - Quality 0-1 (default: 0.8)
 * @returns Resized image URI
 */
export async function resizeForUpload(
  uri: string,
  maxWidth: number = 1024,
  maxHeight: number = 1024,
  quality: number = 0.8
): Promise<string> {
  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: maxWidth, height: maxHeight } }],
      { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
  } catch (error) {
    console.error('Error resizing image:', error);
    return uri;
  }
}

/**
 * Get the file extension from a URI
 * @param uri - File URI
 * @returns File extension (e.g., 'jpg', 'png')
 */
export function getFileExtension(uri: string): string {
  const parts = uri.split('.');
  return parts[parts.length - 1].toLowerCase() || 'jpg';
}

/**
 * Format a file size in bytes to a human-readable string
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., '1.5 MB')
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
