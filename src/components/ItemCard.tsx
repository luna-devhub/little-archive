import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, typography, textures } from '../theme';
import { Item } from '../stores/items';
import { storageService } from '../services/storage';

interface ItemCardProps {
  item: Item;
  onPress: () => void;
}

export const ItemCard = ({ item, onPress }: ItemCardProps) => {
  const imageUri = item.useCropped && item.croppedPhotoUri
    ? item.croppedPhotoUri
    : item.originalPhotoUri;

  const displayUri = storageService.getDisplayUri(imageUri);

  return (
    <TouchableOpacity style={[styles.card, textures.card]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.thumbnailContainer}>
        {imageUri ? (
          <Image
            source={{ uri: displayUri }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>📷</Text>
          </View>
        )}
      </View>
      <Text style={typography.bodySmall} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cream,
    padding: 12,
    width: '48%',
  },
  thumbnailContainer: {
    width: '100%',
    height: 120,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
    backgroundColor: colors.parchment,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 32,
  },
});
