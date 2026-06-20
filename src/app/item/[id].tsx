import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, TextInput, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Edit2, Trash2, Save, X } from 'lucide-react-native';
import { colors, typography, textures } from '../../theme';
import { useItemsStore, Item } from '../../stores/items';
import { storageService } from '../../services/storage';

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, updateItem, deleteItem } = useItemsStore();
  const [item, setItem] = useState<Item | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Editable fields
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editFunFacts, setEditFunFacts] = useState('');
  const [editUseCropped, setEditUseCropped] = useState(false);

  useEffect(() => {
    if (id && items.length > 0) {
      const found = items.find(i => i.id === id);
      if (found) {
        setItem(found);
        setEditName(found.name);
        setEditDescription(found.description);
        setEditFunFacts(found.funFacts);
        setEditUseCropped(found.useCropped);
      }
      setIsLoading(false);
    } else if (id && items.length === 0) {
      const timer = setTimeout(() => setIsLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [id, items]);

  const handleSave = async () => {
    if (!item || !editName.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }

    try {
      await updateItem(item.id, {
        name: editName.trim(),
        description: editDescription.trim(),
        funFacts: editFunFacts.trim(),
        useCropped: editUseCropped,
      });
      setIsEditing(false);
      Alert.alert('Success', 'Item updated successfully');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update item');
    }
  };

  const handleDelete = () => {
    if (!item) return;

    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteItem(item.id);
              router.back();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  const handleCancelEdit = () => {
    if (item) {
      setEditName(item.name);
      setEditDescription(item.description);
      setEditFunFacts(item.funFacts);
      setEditUseCropped(item.useCropped);
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.leather} />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Text style={typography.h2}>Item not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={typography.button}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const imageUri = item.useCropped && item.croppedPhotoUri
    ? item.croppedPhotoUri
    : item.originalPhotoUri;

  const displayUri = storageService.getDisplayUri(imageUri);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.ink} />
        </TouchableOpacity>
        <View style={styles.headerContent} />
        {isEditing ? (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
            <X size={20} color={colors.ink} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Edit2 size={20} color={colors.leather} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Trash2 size={20} color={colors.waxSeal} />
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: displayUri }} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>📷</Text>
          </View>
        )}

        {/* Toggle between cropped/original */}
        {item.croppedPhotoUri && (
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, item.useCropped && styles.toggleActive]}
              onPress={() => {
                if (isEditing) {
                  setEditUseCropped(true);
                }
              }}
            >
              <Text style={[styles.toggleText, item.useCropped && styles.toggleTextActive]}>
                Cropped
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, !item.useCropped && styles.toggleActive]}
              onPress={() => {
                if (isEditing) {
                  setEditUseCropped(false);
                }
              }}
            >
              <Text style={[styles.toggleText, !item.useCropped && styles.toggleTextActive]}>
                Original
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={[styles.infoCard, textures.card]}>
        {isEditing ? (
          <>
            <View style={styles.inputGroup}>
              <Text style={typography.label}>Name</Text>
              <TextInput
                style={[styles.input, textures.input]}
                value={editName}
                onChangeText={setEditName}
                placeholder="Object name"
                placeholderTextColor={colors.fadedInk}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.inputGroup}>
              <Text style={typography.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea, textures.input]}
                value={editDescription}
                onChangeText={setEditDescription}
                placeholder="Describe this object"
                placeholderTextColor={colors.fadedInk}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.inputGroup}>
              <Text style={typography.label}>Fun Facts</Text>
              <TextInput
                style={[styles.input, styles.textArea, textures.input]}
                value={editFunFacts}
                onChangeText={setEditFunFacts}
                placeholder="Share interesting facts"
                placeholderTextColor={colors.fadedInk}
                multiline
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Save size={20} color={colors.cream} />
              <Text style={typography.button}>Save Changes</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={typography.h2}>{item.name}</Text>

            <View style={styles.divider} />

            <Text style={typography.label}>Description</Text>
            <Text style={typography.body}>
              {item.description || 'No description provided.'}
            </Text>

            <View style={styles.divider} />

            <Text style={typography.label}>Fun Facts</Text>
            <Text style={typography.body}>
              {item.funFacts || 'No fun facts yet.'}
            </Text>

            {item.editedAt && (
              <>
                <View style={styles.divider} />
                <Text style={typography.bodySmall}>
                  Last edited: {item.editedAt.toLocaleDateString()}
                </Text>
              </>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.parchment,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.parchment,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.parchment,
    padding: 24,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerContent: {
    flex: 1,
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  cancelButton: {
    padding: 8,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
  imageContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    backgroundColor: colors.cream,
  },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: colors.cream,
    justifyContent: 'center',
    alignItems: 'center',
    ...textures.card,
  },
  placeholderText: {
    fontSize: 64,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
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
  toggleText: {
    ...typography.bodySmall,
    color: colors.ink,
  },
  toggleTextActive: {
    color: colors.cream,
  },
  infoCard: {
    backgroundColor: colors.cream,
    marginHorizontal: 24,
    marginBottom: 40,
    padding: 24,
  },
  divider: {
    height: 1,
    backgroundColor: colors.agedPaper,
    marginVertical: 16,
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
  saveButton: {
    backgroundColor: colors.leather,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
    marginTop: 16,
  },
});
