import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, Modal } from 'react-native';
import { router } from 'expo-router';
import { User, Moon, Trash2, Info, LogOut, Edit2, X } from 'lucide-react-native';
import { colors, typography, textures } from '../../theme';
import { useAuthStore } from '../../stores/auth';
import { storageService } from '../../services/storage';

export default function SettingsScreen() {
  const { user, logout, updateDisplayName } = useAuthStore();
  const [editNameVisible, setEditNameVisible] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || '');

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/(auth)/login');
            } catch (err: any) {
              Alert.alert('Error', err.message);
            }
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your collections and items. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            try {
              await storageService.clearAllImages();
              Alert.alert('Success', 'All local images have been cleared.');
            } catch (err: any) {
              Alert.alert('Error', 'Failed to clear data.');
            }
          },
        },
      ]
    );
  };

  const handleUpdateName = async () => {
    if (!newDisplayName.trim()) {
      Alert.alert('Error', 'Please enter a display name');
      return;
    }

    try {
      await updateDisplayName(newDisplayName.trim());
      setEditNameVisible(false);
      Alert.alert('Success', 'Display name updated');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update display name');
    }
  };

  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    destructive?: boolean
  ) => (
    <TouchableOpacity
      style={[styles.settingItem, textures.card]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingIcon}>{icon}</View>
      <View style={styles.settingContent}>
        <Text style={[typography.body, destructive && styles.destructiveText]}>{title}</Text>
        {subtitle && <Text style={typography.bodySmall}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={typography.h1}>Settings</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <User size={32} color={colors.leather} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={typography.h3}>{user?.displayName || 'Collector'}</Text>
          <Text style={typography.bodySmall}>{user?.email}</Text>
        </View>
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => {
            setNewDisplayName(user?.displayName || '');
            setEditNameVisible(true);
          }}
        >
          <Edit2 size={16} color={colors.leather} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={typography.label}>Account</Text>
        {renderSettingItem(
          <User size={20} color={colors.leather} />,
          'Edit Profile',
          'Change your display name',
          () => {
            setNewDisplayName(user?.displayName || '');
            setEditNameVisible(true);
          }
        )}
      </View>

      <View style={styles.section}>
        <Text style={typography.label}>Appearance</Text>
        {renderSettingItem(
          <Moon size={20} color={colors.leather} />,
          'Dark Mode',
          'Coming soon',
          () => Alert.alert('Coming Soon', 'Dark mode will be available in a future update')
        )}
      </View>

      <View style={styles.section}>
        <Text style={typography.label}>Data</Text>
        {renderSettingItem(
          <Trash2 size={20} color={colors.waxSeal} />,
          'Clear Local Images',
          'Remove all cached images from device',
          handleClearData,
          true
        )}
      </View>

      <View style={styles.section}>
        <Text style={typography.label}>About</Text>
        {renderSettingItem(
          <Info size={20} color={colors.leather} />,
          'About Little Archive',
          'Version 1.0.0',
          () => Alert.alert(
            'Little Archive',
            'A personal field journal for cataloging your finds.\n\nVersion 1.0.0\nBuilt with Expo & Firebase'
          )
        )}
      </View>

      <View style={styles.section}>
        {renderSettingItem(
          <LogOut size={20} color={colors.waxSeal} />,
          'Sign Out',
          undefined,
          handleSignOut,
          true
        )}
      </View>

      {/* Edit Name Modal */}
      <Modal visible={editNameVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={typography.h2}>Edit Display Name</Text>
              <TouchableOpacity onPress={() => setEditNameVisible(false)}>
                <X size={24} color={colors.ink} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <Text style={typography.label}>Display Name</Text>
              <TextInput
                style={[styles.input, textures.input]}
                value={newDisplayName}
                onChangeText={setNewDisplayName}
                placeholder="Your name"
                placeholderTextColor={colors.fadedInk}
              />

              <TouchableOpacity style={styles.saveButton} onPress={handleUpdateName}>
                <Text style={typography.button}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cream,
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#2C1810',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.parchment,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  editProfileButton: {
    padding: 8,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cream,
    padding: 16,
    marginTop: 8,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.parchment,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  destructiveText: {
    color: colors.waxSeal,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.parchment,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  modalContent: {
    paddingHorizontal: 24,
    gap: 16,
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
  saveButton: {
    backgroundColor: colors.leather,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
});
