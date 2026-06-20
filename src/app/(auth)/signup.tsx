import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { colors, typography, textures } from '../../theme';
import { useAuthStore } from '../../stores/auth';

export default function SignupScreen() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signUp, isLoading } = useAuthStore();

  const handleSignUp = async () => {
    if (!displayName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      console.log('Starting signup process...');
      await signUp(email.trim(), password, displayName.trim());
      console.log('Signup completed, navigating to tabs');
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('Signup failed:', err);
      Alert.alert('Sign Up Failed', err.message || 'Unknown error occurred');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={typography.h1}>Little Archive</Text>
        <Text style={typography.bodySmall}>Start your collection</Text>
      </View>

      <View style={[styles.card, textures.card]}>
        <Text style={typography.h2}>Create Account</Text>

        <View style={styles.inputGroup}>
          <Text style={typography.label}>Display Name</Text>
          <TextInput
            style={[styles.input, textures.input]}
            placeholder="Your name"
            placeholderTextColor={colors.fadedInk}
            value={displayName}
            onChangeText={setDisplayName}
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={typography.label}>Email</Text>
          <TextInput
            style={[styles.input, textures.input]}
            placeholder="your@email.com"
            placeholderTextColor={colors.fadedInk}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={typography.label}>Password</Text>
          <TextInput
            style={[styles.input, textures.input]}
            placeholder="Create a password (min 6 characters)"
            placeholderTextColor={colors.fadedInk}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={typography.label}>Confirm Password</Text>
          <TextInput
            style={[styles.input, textures.input]}
            placeholder="Confirm your password"
            placeholderTextColor={colors.fadedInk}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.cream} />
          ) : (
            <Text style={typography.button}>Create Account</Text>
          )}
        </TouchableOpacity>

        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.linkTextBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.parchment,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  card: {
    backgroundColor: colors.cream,
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
  button: {
    backgroundColor: colors.leather,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 8,
  },
  linkText: {
    ...typography.bodySmall,
    color: colors.fadedInk,
  },
  linkTextBold: {
    color: colors.leather,
    fontFamily: 'Lora-Bold',
  },
});
