import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, textures } from '../theme';
import { CollectionIcon } from './CollectionIcon';

interface CollectionCardProps {
  name: string;
  icon: string;
  itemCount?: number;
  onPress: () => void;
}

export const CollectionCard = ({ name, icon, itemCount = 0, onPress }: CollectionCardProps) => {
  return (
    <TouchableOpacity style={[styles.card, textures.card]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <CollectionIcon name={icon} size={24} color={colors.leather} />
      </View>
      <Text style={typography.h3} numberOfLines={1}>
        {name}
      </Text>
      <Text style={typography.bodySmall}>
        {itemCount} {itemCount === 1 ? 'item' : 'items'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cream,
    padding: 16,
    width: '48%',
    minHeight: 120,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.parchment,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
});
