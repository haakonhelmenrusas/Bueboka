import { Linking, Platform, Text, View } from 'react-native';
import { Button } from '@/components/common';
import { styles } from '@/components/settings/SettingsStyles';
import { useTranslation } from '@/contexts';

const VIPPS_NUMBER = '44294';

export default function SupportCard() {
  const { t } = useTranslation();

  function handleOpenVipps() {
    const url = Platform.OS === 'ios' ? `vipps://qr/28/2/01/031/${VIPPS_NUMBER}` : `https://qr.vipps.no/28/2/01/031/${VIPPS_NUMBER}`;
    Linking.openURL(url).catch(() => {
      Linking.openURL('https://vipps.no');
    });
  }

  return (
    <View style={styles.supportContent}>
      <Text style={styles.supportTitle}>{t['settings.supportTitle']}</Text>
      <Text style={styles.supportDesc}>{t['settings.supportDesc']}</Text>
      <View style={styles.vippsBox}>
        <Text style={styles.vippsLabel}>{t['settings.vippsLabel']}</Text>
        <Text style={styles.vippsNumber}>{VIPPS_NUMBER}</Text>
      </View>
      <Button label={t['settings.vippsButton']} onPress={handleOpenVipps} buttonStyle={styles.vippsButton} />
    </View>
  );
}
