import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Button from '@/components/common/Button/Button';
import { colors } from '@/styles/colors';
import { VersionService } from '@/services/versionService';
import { useTranslation } from '@/contexts';

interface UpdateRequiredProps {
  message: string;
  storeUrl: string;
}

export default function UpdateRequired({ message, storeUrl }: UpdateRequiredProps) {
  const { t } = useTranslation();

  const handleUpdate = () => {
    VersionService.openStore(storeUrl);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={require('@/assets/images/icon.png')} style={styles.icon} />
        <Text style={styles.title}>{t['update.title']}</Text>
        <Text style={styles.message}>{message}</Text>
        <Button label={t['update.button']} onPress={handleUpdate} variant="tertiary" buttonStyle={styles.button} />
        <Text style={styles.subtext}>{t['update.subtext']}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 32,
    borderRadius: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    width: '100%',
    minWidth: 200,
    marginBottom: 16,
  },
  subtext: {
    fontSize: 14,
    color: colors.inactive,
    textAlign: 'center',
    lineHeight: 20,
  },
});
