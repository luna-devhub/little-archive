import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { colors, typography, textures } from '../../theme';
import { useAuthStore } from '../../stores/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, isLoading, error, clearError } = useAuthStore();

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      await signIn(email.trim(), password);
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Sign In Failed', err.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Reset Password', 'Please enter your email address first');
      return;
    }

    try {
      const { resetPassword } = useAuthStore.getState();
      await resetPassword(email.trim());
      Alert.alert('Reset Email Sent', 'Check your inbox for password reset instructions');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={typography.h1}>Little Archive</Text>
        <Text style={typography.bodySmall}>Your personal field journal</Text>
      </View>

      <View style={[styles.card, textures.card]}>
        <Text style={typography.h2}>Welcome Back</Text>

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
            placeholder="Enter your password"
            placeholderTextColor={colors.fadedInk}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity onPress={handleForgotPassword} disabled={isLoading}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.cream} />
          ) : (
            <Text style={typography.button}>Sign In</Text>
          )}
        </TouchableOpacity>

        <Link href="/(auth)/signup" asChild>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>
              Don't have an account? <Text style={styles.linkTextBold}>Sign Up</Text>
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
  forgotPasswordText: {
    ...typography.bodySmall,
    color: colors.leather,
    textAlign: 'right',
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
