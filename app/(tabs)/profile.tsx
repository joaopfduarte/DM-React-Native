import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLoginMutation } from '@/hooks/useAuthMutations';
import { ThemePreference } from '@/services/storage.service';

const themeOptions: { label: string; value: ThemePreference }[] = [
  { label: 'Sistema', value: 'system' },
  { label: 'Claro', value: 'light' },
  { label: 'Escuro', value: 'dark' },
];

export default function Profile() {
  const router = useRouter();
  const { colors, preference, setPreference } = useTheme();
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const {
    mutate: handleLogin,
    loading: submitting,
    error: apiError,
    reset: resetError,
  } = useLoginMutation();

  async function onSubmit() {
    if (!email || !password) {
      setValidationError('Por favor, preencha todos os campos.');
      return;
    }

    setValidationError('');

    try {
      await handleLogin({ email: email.trim(), password });
    } catch {
      resetError();
    }
  }

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isAuthenticated && user) {
    return (
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, { backgroundColor: colors.backgroundSecondary }]}
      >
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.header}>
            <Text style={styles.emoji}>🌿</Text>
            <Text style={[styles.title, { color: colors.text }]}>Olá, {user.name}!</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{user.email}</Text>
          </View>

          <Text style={[styles.sectionLabel, { color: colors.text }]}>Preferência de tema</Text>
          <View style={styles.themeRow}>
            {themeOptions.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.themeChip,
                  {
                    backgroundColor: preference === option.value ? colors.primary : colors.inputBackground,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setPreference(option.value)}
              >
                <Text
                  style={{
                    color: preference === option.value ? colors.white : colors.text,
                    fontWeight: '600',
                  }}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={logout}
          >
            <Text style={styles.buttonText}>Sair</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.header}>
            <Text style={styles.emoji}>🌿</Text>
            <Text style={[styles.title, { color: colors.text }]}>Entrar</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Bem-vindo de volta!</Text>
          </View>

          {(validationError || apiError) ? (
            <View
              style={[
                styles.errorBanner,
                { backgroundColor: colors.errorBackground, borderColor: colors.errorBorder },
              ]}
            >
              <Text style={[styles.errorText, { color: colors.error }]}>
                {validationError || apiError}
              </Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>E-mail</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                },
              ]}
              placeholder="seu@email.com"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Senha</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.inputBackground,
                  color: colors.text,
                },
              ]}
              placeholder="Sua senha"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Pressable
            style={[
              styles.button,
              { backgroundColor: colors.primary },
              submitting && { backgroundColor: colors.primaryDisabled },
            ]}
            onPress={onSubmit}
            disabled={submitting || !email || !password}
          >
            {submitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </Pressable>

          <Pressable style={styles.footerLink} onPress={() => router.push('/register')}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Não tem uma conta?{' '}
              <Text style={[styles.boldText, { color: colors.primary }]}>Cadastrar</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 12,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  themeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  themeChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  errorBanner: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
  },
  helperText: {
    fontSize: 13,
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    height: 50,
  },
  button: {
    height: 50,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  boldText: {
    fontWeight: '700',
  },
});
