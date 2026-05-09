import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { register } from "../services/userService";
import { useRouter } from "expo-router";

function Register() {
  const navigation = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleRegister() {
    if (!name || !email || !password) {
      setApiError("Por favor, preencha todos os campos.");
      return;
    }

    setApiError("");
    setSubmitting(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password: password,
      });

      setSuccess(true);
      navigation.push("/profile")
    } catch (err: any) {
      console.log(err);
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", err.response?.data);
      console.log("MESSAGE:", err.response?.data?.message);
      setApiError(
        err.response?.data.detail
          ? err.response?.data.detail
          : "Ocorreu um erro ao realizar cadastro. Tente novamente mais tarde",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.emoji}>🌿</Text>
            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.subtitle}>Junte-se aos Amigos da Fauna</Text>
          </View>

          {success ? (
            <View style={styles.successContainer}>
              <Text style={styles.successTitle}>Conta criada com sucesso!</Text>
              <Text style={styles.successSubtitle}>Redirecionando…</Text>
            </View>
          ) : (
            <View>
              {apiError ? (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{apiError}</Text>
                </View>
              ) : null}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Seu nome completo"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>E-mail</Text>
                <TextInput
                  style={styles.input}
                  placeholder="seu@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Senha</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <Pressable
                style={[styles.button, submitting && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.buttonText}>Cadastrar</Text>
                )}
              </Pressable>

              <Pressable
                style={styles.footerLink}
                onPress={() => navigation.push("/profile")}
              >
                <Text style={styles.footerText}>
                  Já tem uma conta? <Text style={styles.boldText}>Entrar</Text>
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
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 32,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  successContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  successEmoji: {
    fontSize: 50,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  errorBanner: {
    backgroundColor: "#FFF1F0",
    borderWidth: 1,
    borderColor: "#FFA39E",
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  errorText: {
    color: "#F5222D",
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    height: 48,
    backgroundColor: "#FAFAFA",
  },
  button: {
    height: 48,
    backgroundColor: "#4A5D23",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  buttonDisabled: {
    backgroundColor: "#A2B086",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  footerLink: {
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    color: "#666",
    fontSize: 14,
  },
  boldText: {
    fontWeight: "700",
    color: "#4A5D23",
  },
});

export default Register;
