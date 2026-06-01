import React from 'react';
import { View, Text, Image } from 'react-native';
import Button from '@/components/common/Button/Button';
import { VersionService } from '@/services/versionService';
import { useTranslation } from '@/contexts';
import { styles } from './UpdateRequiredStyles';

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
