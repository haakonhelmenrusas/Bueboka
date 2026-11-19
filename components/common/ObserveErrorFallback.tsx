import { Text, View } from 'react-native';
import * as Updates from 'expo-updates';
import Button from './Button/Button';
import { useTranslation } from '@/contexts';
import { colors } from '@/styles/colors';

/**
 * Render fallback for ObserveRoot's error boundary (Expo Observe).
 * Shown in place of the whole app when a render error is recorded.
 */
export default function ObserveErrorFallback() {
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 }}>
      <Text style={{ color: colors.white, fontSize: 20, fontWeight: '700', textAlign: 'center' }}>{t['common.error']}</Text>
      <Text style={{ color: colors.white, fontSize: 15, textAlign: 'center' }}>{t['observe.errorFallbackMessage']}</Text>
      <Button label={t['common.tryAgain']} onPress={() => Updates.reloadAsync()} buttonStyle={{ marginTop: 8 }} />
    </View>
  );
}
