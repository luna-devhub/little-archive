import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Camera as CameraIcon, Image, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, typography } from '../theme';
import { resizeForUpload, imageToBase64 } from '../utils/image';

export default function CameraScreen() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTakePhoto = async () => {
    try {
      // Request camera permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission',
          'We need camera access to take photos of your finds. Please enable it in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => ImagePicker.requestCameraPermissionsAsync() },
          ]
        );
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'Images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch (error: any) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handlePickFromGallery = async () => {
    try {
      // Request media library permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Photo Library Access',
          'We need access to your photos to select images. Please enable it in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => ImagePicker.requestMediaLibraryPermissionsAsync() },
          ]
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch (error: any) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const processImage = async (uri: string) => {
    setIsProcessing(true);

    try {
      // Resize image for upload
      const resizedUri = await resizeForUpload(uri);

      // Convert to base64
      const base64 = await imageToBase64(resizedUri);

      // Navigate to review screen with the image data
      router.push({
        pathname: '/review',
        params: {
          imageUri: resizedUri,
          imageBase64: base64,
        },
      });
    } catch (error: any) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.preview}>
        {isProcessing ? (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color={colors.leather} />
            <Text style={typography.body}>Processing image...</Text>
          </View>
        ) : (
          <View style={styles.placeholder}>
            <CameraIcon size={64} color={colors.fadedInk} />
            <Text style={typography.h3}>Capture Your Find</Text>
            <Text style={typography.bodySmall}>
              Take a photo or choose from your gallery
            </Text>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.galleryButton}
          onPress={handlePickFromGallery}
          disabled={isProcessing}
        >
          <Image size={24} color={colors.ink} />
          <Text style={typography.bodySmall}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.captureButton}
          onPress={handleTakePhoto}
          disabled={isProcessing}
        >
          <View style={styles.captureInner} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
          disabled={isProcessing}
        >
          <X size={24} color={colors.ink} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  preview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    alignItems: 'center',
    gap: 16,
    padding: 24,
  },
  processingContainer: {
    alignItems: 'center',
    gap: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    backgroundColor: colors.black,
  },
  galleryButton: {
    alignItems: 'center',
    gap: 4,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: colors.cream,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.cream,
  },
  closeButton: {
    alignItems: 'center',
    gap: 4,
  },
});
