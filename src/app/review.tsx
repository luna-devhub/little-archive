import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Save, RefreshCw } from 'lucide-react-native';
import { colors, typography, textures } from '../theme';
import { identifyObject, removeBackground } from '../services/ai';
import { storageService } from '../services/storage';
import { useCollectionsStore } from '../stores/collections';
import { useItemsStore } from '../stores/items';

export default function ReviewScreen() {
  const params = useLocalSearchParams<{
    imageUri: string;
    imageBase64: string;
  }>();

  const { collections, fetchCollections } = useCollectionsStore();

  const [imageUri, setImageUri] = useState(params.imageUri || '');
  const [croppedImageUri, setCroppedImageUri] = useState('');
  const [useCropped, setUseCropped] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [funFacts, setFunFacts] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState('');

  useEffect(() => {
    fetchCollections();
    if (params.imageBase64) {
      analyzeImage(params.imageBase64);
    }
  }, []);

  const analyzeImage = async (base64: string) => {
    setIsProcessing(true);

    try {
      const result = await identifyObject(base64);
      setName(result.name);
      setDescription(result.description);
      setFunFacts(result.funFacts);
    } catch (error: any) {
      console.error('Error analyzing image:', error);
      Alert.alert(
        'Identification Failed',
        'Could not identify the object. You can enter the details manually.',
        [{ text: 'OK' }]
      );
      setName('Unknown Object');
      setDescription('');
      setFunFacts('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveBackground = async () => {
    if (!params.imageBase64) return;

    setIsRemovingBg(true);

    try {
      const croppedBase64 = await removeBackground(params.imageBase64);

      // Save cropped image locally
      const croppedUri = await storageService.saveBase64Image(croppedBase64, 'cropped');
      setCroppedImageUri(croppedUri);
      setUseCropped(true);

      Alert.alert('Success', 'Background removed successfully!');
    } catch (error: any) {
      console.error('Error removing background:', error);
      Alert.alert(
        'Background Removal Failed',
        'Could not remove the background. You can use the original image.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsRemovingBg(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name for this item');
      return;
    }

    if (!selectedCollectionId) {
      Alert.alert('Error', 'Please select a collection');
      return;
    }

    setIsSaving(true);

    try {
      // Save the original image locally
      const savedOriginalUri = await storageService.saveImage(imageUri, 'original');

      // Save cropped image locally if exists
      let savedCroppedUri: string | undefined;
      if (croppedImageUri) {
        savedCroppedUri = await storageService.saveImage(croppedImageUri, 'cropped');
      }

      // Save item to Firestore
      const { createItem } = useItemsStore.getState();
      await createItem({
        collectionId: selectedCollectionId,
        originalPhotoUri: savedOriginalUri,
        croppedPhotoUri: savedCroppedUri,
        useCropped: useCropped,
        name: name.trim(),
        description: description.trim(),
        funFacts: funFacts.trim(),
      });

      Alert.alert(
        'Item Saved!',
        `"${name}" has been added to your collection.`,
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error saving item:', error);
      Alert.alert('Error', 'Failed to save item. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const displayImageUri = useCropped && croppedImageUri ? croppedImageUri : imageUri;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.ink} />
        </TouchableOpacity>
        <Text style={typography.h2}>Review & Identify</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.imageContainer}>
        {displayImageUri ? (
          <Image source={{ uri: displayImageUri }} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>📷</Text>
          </View>
        )}
      </View>

      {isProcessing ? (
        <View style={styles.processingIndicator}>
          <ActivityIndicator size="large" color={colors.leather} />
          <Text style={typography.body}>Examining your find...</Text>
        </View>
      ) : (
        <View style={[styles.formCard, textures.card]}>
          <Text style={typography.h3}>AI Results</Text>

          <View style={styles.inputGroup}>
            <Text style={typography.label}>Name</Text>
            <TextInput
              style={[styles.input, textures.input]}
              value={name}
              onChangeText={setName}
              placeholder="Object name"
              placeholderTextColor={colors.fadedInk}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={typography.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea, textures.input]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe this object"
              placeholderTextColor={colors.fadedInk}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={typography.label}>Fun Facts</Text>
            <TextInput
              style={[styles.input, styles.textArea, textures.input]}
              value={funFacts}
              onChangeText={setFunFacts}
              placeholder="Share interesting facts"
              placeholderTextColor={colors.fadedInk}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.toggleContainer}>
            <Text style={typography.label}>Image</Text>
            <View style={styles.toggleButtons}>
              <TouchableOpacity
                style={[styles.toggleButton, useCropped && styles.toggleActive]}
                onPress={() => setUseCropped(true)}
                disabled={!croppedImageUri}
              >
                <Text style={[typography.bodySmall, useCropped && styles.toggleActiveText]}>
                  Cropped
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, !useCropped && styles.toggleActive]}
                onPress={() => setUseCropped(false)}
              >
                <Text style={[typography.bodySmall, !useCropped && styles.toggleActiveText]}>
                  Original
                </Text>
              </TouchableOpacity>
            </View>

            {!croppedImageUri && (
              <TouchableOpacity
                style={styles.removeBgButton}
                onPress={handleRemoveBackground}
                disabled={isRemovingBg}
              >
                {isRemovingBg ? (
                  <ActivityIndicator size="small" color={colors.leather} />
                ) : (
                  <RefreshCw size={16} color={colors.leather} />
                )}
                <Text style={styles.removeBgText}>
                  {isRemovingBg ? 'Removing background...' : 'Remove Background'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={typography.label}>Collection</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.collectionList}>
              {collections.map((col) => (
                <TouchableOpacity
                  key={col.id}
                  style={[
                    styles.collectionChip,
                    selectedCollectionId === col.id && styles.collectionChipSelected,
                  ]}
                  onPress={() => setSelectedCollectionId(col.id)}
                >
                  <Text
                    style={[
                      styles.collectionChipText,
                      selectedCollectionId === col.id && styles.collectionChipTextSelected,
                    ]}
                  >
                    {col.name}
                  </Text>
                </TouchableOpacity>
              ))}
              {collections.length === 0 && (
                <Text style={typography.bodySmall}>No collections yet. Create one first.</Text>
              )}
            </ScrollView>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color={colors.cream} />
            ) : (
              <>
                <Save size={20} color={colors.cream} />
                <Text style={typography.button}>Save to Collection</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.parchment,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    marginRight: 16,
  },
  placeholder: {
    width: 40,
  },
  imageContainer: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    backgroundColor: colors.cream,
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: colors.cream,
    justifyContent: 'center',
    alignItems: 'center',
    ...textures.card,
  },
  placeholderText: {
    fontSize: 48,
  },
  processingIndicator: {
    alignItems: 'center',
    gap: 16,
    padding: 40,
  },
  formCard: {
    backgroundColor: colors.cream,
    marginHorizontal: 24,
    marginBottom: 40,
    padding: 24,
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  input: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Lora-Regular',
    color: colors.ink,
    borderWidth: 1,
    borderColor: colors.agedPaper,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  toggleContainer: {
    gap: 8,
  },
  toggleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.agedPaper,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: colors.leather,
    borderColor: colors.leather,
  },
  toggleActiveText: {
    color: colors.cream,
  },
  removeBgButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    marginTop: 4,
  },
  removeBgText: {
    ...typography.bodySmall,
    color: colors.leather,
  },
  collectionList: {
    flexDirection: 'row',
  },
  collectionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.agedPaper,
    marginRight: 8,
  },
  collectionChipSelected: {
    backgroundColor: colors.leather,
    borderColor: colors.leather,
  },
  collectionChipText: {
    ...typography.bodySmall,
    color: colors.ink,
  },
  collectionChipTextSelected: {
    color: colors.cream,
  },
  saveButton: {
    backgroundColor: colors.leather,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
});
