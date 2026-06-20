import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Camera, ArrowLeft, Edit2, Trash2, FolderOpen } from 'lucide-react-native';
import { colors, typography, textures } from '../../theme';
import { CollectionIcon } from '../../components/CollectionIcon';
import { ItemCard } from '../../components/ItemCard';
import { useCollectionsStore, Collection } from '../../stores/collections';
import { useItemsStore, Item } from '../../stores/items';

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { collections, deleteCollection } = useCollectionsStore();
  const { items, isLoading: itemsLoading, fetchItems, deleteItem } = useItemsStore();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id && collections.length > 0) {
      const found = collections.find(c => c.id === id);
      setCollection(found || null);
      setIsLoading(false);
    } else if (id && collections.length === 0) {
      const timer = setTimeout(() => setIsLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [id, collections]);

  useEffect(() => {
    if (id) {
      fetchItems(id);
    }
  }, [id]);

  const handleDelete = () => {
    if (!collection) return;

    Alert.alert(
      'Delete Collection',
      `Are you sure you want to delete "${collection.name}"? This will also delete all items in this collection.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete all items first
              for (const item of items) {
                await deleteItem(item.id);
              }
              // Then delete the collection
              await deleteCollection(collection.id);
              router.back();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete collection');
            }
          },
        },
      ]
    );
  };

  const handleDeleteItem = (item: Item) => {
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
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  const renderItemCard = ({ item }: { item: Item }) => (
    <ItemCard
      item={item}
      onPress={() => router.push(`/item/${item.id}`)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <FolderOpen size={48} color={colors.fadedInk} />
      <Text style={typography.h3}>No Items Yet</Text>
      <Text style={typography.bodySmall}>
        Add your first find to this collection
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.leather} />
      </View>
    );
  }

  if (!collection) {
    return (
      <View style={styles.errorContainer}>
        <Text style={typography.h2}>Collection not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={typography.button}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <ArrowLeft size={24} color={colors.ink} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.headerTitle}>
            <CollectionIcon name={collection.icon} size={24} color={colors.leather} />
            <Text style={typography.h2}>{collection.name}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Edit2 size={20} color={colors.leather} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Trash2 size={20} color={colors.waxSeal} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderItemCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={items.length > 0 ? styles.grid : undefined}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={itemsLoading}
            onRefresh={() => id && fetchItems(id)}
            colors={[colors.leather]}
            tintColor={colors.leather}
          />
        }
      />

      <TouchableOpacity
        style={styles.cameraButton}
        onPress={() => router.push('/camera')}
      >
        <Camera size={24} color={colors.cream} />
      </TouchableOpacity>
    </View>
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
    backgroundColor: colors.cream,
    borderBottomWidth: 1,
    borderBottomColor: colors.agedPaper,
  },
  backIcon: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
    flexGrow: 1,
  },
  grid: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  backButton: {
    backgroundColor: colors.leather,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.leather,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2C1810',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
});
