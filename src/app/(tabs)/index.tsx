import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Plus, FolderOpen } from 'lucide-react-native';
import { colors, typography, textures } from '../../theme';
import { CollectionCard } from '../../components/CollectionCard';
import { CreateCollectionModal } from '../../components/CreateCollectionModal';
import { useCollectionsStore, Collection } from '../../stores/collections';

export default function HomeScreen() {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const { collections, isLoading, error, fetchCollections, clearError } = useCollectionsStore();

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleCollectionPress = (collection: Collection) => {
    router.push(`/collection/${collection.id}`);
  };

  const renderCollectionCard = ({ item }: { item: Collection }) => (
    <CollectionCard
      name={item.name}
      icon={item.icon}
      itemCount={item.itemCount}
      onPress={() => handleCollectionPress(item)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <FolderOpen size={64} color={colors.fadedInk} />
      <Text style={typography.h3}>No Collections Yet</Text>
      <Text style={typography.bodySmall}>
        Start your archive by creating your first collection
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => setCreateModalVisible(true)}
      >
        <Plus size={20} color={colors.cream} />
        <Text style={typography.button}>Create Collection</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={typography.h1}>My Collections</Text>
        <Text style={typography.bodySmall}>Your treasured finds</Text>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={clearError}>
            <Text style={styles.errorDismiss}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

      {isLoading && collections.length === 0 ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.leather} />
        </View>
      ) : (
        <FlatList
          data={collections}
          renderItem={renderCollectionCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={collections.length > 0 ? styles.grid : undefined}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchCollections}
              colors={[colors.leather]}
              tintColor={colors.leather}
            />
          }
        />
      )}

      {collections.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setCreateModalVisible(true)}
        >
          <Plus size={24} color={colors.cream} />
        </TouchableOpacity>
      )}

      <CreateCollectionModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.parchment,
  },
  header: {
    padding: 24,
    paddingTop: 60,
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.leather,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  fab: {
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
  errorBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.waxSeal,
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.cream,
    flex: 1,
  },
  errorDismiss: {
    ...typography.bodySmall,
    color: colors.cream,
    fontFamily: 'Lora-Bold',
    marginLeft: 12,
  },
});
