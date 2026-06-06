import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useMutation } from '@/hooks/useMutation';
import { CreateUserPayload } from '@/types/user';

export default function Register() {
  const router = useRouter();
  const { colors } = useTheme();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    mutate: handleRegister,
    loading: submitting,
    error: apiError,
  } = useMutation<void, CreateUserPayload>(async (payload) => {
    await register(payload);
    setSuccess(true);
    setTimeout(() => router.replace('/profile'), 1500);
  });

  async function onSubmit() {
    if (!name || !email || !password) {
      setValidationError('Por favor, preencha todos os campos.');
      return;
    }

    setValidationError('');

    try {
      await handleRegister({
        name: name.trim(),
        email: email.trim(),
        password,
      });
    } catch {
      // handled by useMutation
    }
  }

  const displayError = validationError || apiError;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.header}>
            <Text style={styles.emoji}>🌿</Text>
            <Text style={[styles.title, { color: colors.text }]}>Criar conta</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Junte-se aos Amigos da Fauna
            </Text>
          </View>

          {success ? (
            <View style={styles.successContainer}>
              <Text style={[styles.successTitle, { color: colors.text }]}>
                Conta criada com sucesso!
              </Text>
              <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
                Redirecionando para login…
              </Text>
            </View>
          ) : (
            <View>
              {displayError ? (
                <View
                  style={[
                    styles.errorBanner,
                    { backgroundColor: colors.errorBackground, borderColor: colors.errorBorder },
                  ]}
                >
                  <Text style={[styles.errorText, { color: colors.error }]}>{displayError}</Text>
                </View>
              ) : null}

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Nome</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.inputBackground,
                      color: colors.text,
                    },
                  ]}
                  placeholder="Seu nome completo"
                  placeholderTextColor={colors.textMuted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

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
                  placeholder="Mínimo 6 caracteres"
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
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.buttonText}>Cadastrar</Text>
                )}
              </Pressable>

              <Pressable style={styles.footerLink} onPress={() => router.push('/profile')}>
                <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                  Já tem uma conta?{' '}
                  <Text style={[styles.boldText, { color: colors.primary }]}>Entrar</Text>
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 12,
    padding: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
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
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 14,
    marginTop: 8,
  },
  errorBanner: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    height: 48,
  },
  button: {
    height: 48,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
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
