import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { X } from 'lucide-react-native';
import { colors, typography } from '../theme';
import { AVAILABLE_ICONS, CollectionIcon } from './CollectionIcon';

interface IconPickerProps {
  visible: boolean;
  selectedIcon: string;
  onSelect: (icon: string) => void;
  onClose: () => void;
}

export const IconPicker = ({ visible, selectedIcon, onSelect, onClose }: IconPickerProps) => {
  const renderItem = ({ item }: { item: string }) => {
    const isSelected = item === selectedIcon;

    return (
      <TouchableOpacity
        style={[styles.iconButton, isSelected && styles.iconButtonSelected]}
        onPress={() => {
          onSelect(item);
          onClose();
        }}
      >
        <CollectionIcon
          name={item}
          size={28}
          color={isSelected ? colors.cream : colors.leather}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={typography.h2}>Choose an Icon</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.ink} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={AVAILABLE_ICONS}
            renderItem={renderItem}
            keyExtractor={(item) => item}
            numColumns={5}
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
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
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  closeButton: {
    padding: 4,
  },
  grid: {
    paddingHorizontal: 16,
  },
  iconButton: {
    width: '20%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  iconButtonSelected: {
    backgroundColor: colors.leather,
    borderRadius: 12,
  },
});
