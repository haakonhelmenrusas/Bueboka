import { Text, View } from 'react-native';
import { styles } from '@/components/settings/SettingsStyles';
import { useTranslation } from '@/contexts';

const VIPPS_NUMBER = '44294';

export default function SupportCard() {
  const { t } = useTranslation();

  return (
    <View style={styles.supportContent}>
      <Text style={styles.supportTitle}>{t['settings.supportTitle']}</Text>
      <Text style={styles.supportDesc}>{t['settings.supportDesc']}</Text>
      <View style={styles.vippsBox}>
        <Text style={styles.vippsLabel}>{t['settings.vippsLabel']}</Text>
        <Text style={styles.vippsNumber}>{VIPPS_NUMBER}</Text>
      </View>
    </View>
  );
}
