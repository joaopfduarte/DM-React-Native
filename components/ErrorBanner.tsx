import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.errorBackground,
          borderColor: colors.errorBorder,
        },
      ]}
    >
      <Text style={[styles.message, { color: colors.error }]}>{message}</Text>
      {onRetry ? (
        <Pressable
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={onRetry}
        >
          <Text style={styles.retryText}>Tentar novamente</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
