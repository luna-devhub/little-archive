import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import { X } from 'lucide-react-native';
import { colors, typography, textures } from '../theme';
import { CollectionIcon } from './CollectionIcon';
import { IconPicker } from './IconPicker';
import { useCollectionsStore } from '../stores/collections';

interface CreateCollectionModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CreateCollectionModal = ({ visible, onClose }: CreateCollectionModalProps) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Box');
  const [iconPickerVisible, setIconPickerVisible] = useState(false);
  const { createCollection, isLoading } = useCollectionsStore();

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a collection name');
      return;
    }

    try {
      await createCollection(name.trim(), icon);
      setName('');
      setIcon('Box');
      onClose();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to create collection');
    }
  };

  const handleClose = () => {
    setName('');
    setIcon('Box');
    onClose();
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={typography.h2}>New Collection</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <X size={24} color={colors.ink} />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <View style={styles.iconSection}>
                <Text style={typography.label}>Icon</Text>
                <TouchableOpacity
                  style={styles.iconSelector}
                  onPress={() => setIconPickerVisible(true)}
                >
                  <View style={styles.iconPreview}>
                    <CollectionIcon name={icon} size={32} color={colors.leather} />
                  </View>
                  <Text style={styles.iconSelectorText}>Tap to change</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={typography.label}>Name</Text>
                <TextInput
                  style={[styles.input, textures.input]}
                  placeholder="e.g., Backyard Finds"
                  placeholderTextColor={colors.fadedInk}
                  value={name}
                  onChangeText={setName}
                  maxLength={30}
                  editable={!isLoading}
                />
              </View>

              <TouchableOpacity
                style={[styles.createButton, isLoading && styles.buttonDisabled]}
                onPress={handleCreate}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.cream} />
                ) : (
                  <Text style={typography.button}>Create Collection</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <IconPicker
        visible={iconPickerVisible}
        selectedIcon={icon}
        onSelect={setIcon}
        onClose={() => setIconPickerVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.parchment,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 24,
    gap: 20,
  },
  iconSection: {
    gap: 8,
  },
  iconSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cream,
    padding: 16,
    ...textures.card,
  },
  iconPreview: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.parchment,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconSelectorText: {
    ...typography.bodySmall,
    color: colors.leather,
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
  createButton: {
    backgroundColor: colors.leather,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
