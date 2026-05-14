import { Linking, Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faBullseye } from '@fortawesome/free-solid-svg-icons/faBullseye';
import { faKey } from '@fortawesome/free-solid-svg-icons/faKey';
import { faShield } from '@fortawesome/free-solid-svg-icons/faShield';
import { faChartBar } from '@fortawesome/free-solid-svg-icons/faChartBar';
import { colors } from '@/styles/colors';
import { styles } from '@/components/settings/SettingsStyles';
import { useTranslation } from '@/contexts';
import type { TranslationKeys } from '@/lib/i18n/types';

type PrivacyItem = {
  icon: any;
  titleKey: keyof TranslationKeys;
  descKey: keyof TranslationKeys;
};

const PRIVACY_ITEMS: PrivacyItem[] = [
  { icon: faLock, titleKey: 'settings.privacyNeverSharedTitle', descKey: 'settings.privacyNeverSharedDesc' },
  { icon: faBullseye, titleKey: 'settings.privacyAppOnlyTitle', descKey: 'settings.privacyAppOnlyDesc' },
  { icon: faKey, titleKey: 'settings.privacyYourControlTitle', descKey: 'settings.privacyYourControlDesc' },
  { icon: faShield, titleKey: 'settings.privacySecureStorageTitle', descKey: 'settings.privacySecureStorageDesc' },
];

export default function PrivacySection() {
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t['settings.privacyTitle']}</Text>
      <View style={styles.sectionCard}>
        <Text style={styles.privacyIntro}>{t['settings.privacyIntro']}</Text>
        <View style={styles.privacyList}>
          {PRIVACY_ITEMS.map(({ icon, titleKey, descKey }) => (
            <View key={titleKey} style={styles.privacyItem}>
              <View style={styles.privacyIconWrap}>
                <FontAwesomeIcon icon={icon} size={15} color={colors.primary} />
              </View>
              <View style={styles.privacyItemContent}>
                <Text style={styles.privacyItemTitle}>{t[titleKey]}</Text>
                <Text style={styles.privacyItemDesc}>{t[descKey]}</Text>
              </View>
            </View>
          ))}
          <View style={styles.privacyItem}>
            <View style={styles.privacyIconWrap}>
              <FontAwesomeIcon icon={faChartBar} size={15} color={colors.primary} />
            </View>
            <View style={styles.privacyItemContent}>
              <Text style={styles.privacyItemTitle}>{t['settings.privacyAnalyticsTitle']}</Text>
              <Text style={styles.privacyItemDesc}>
                {t['settings.privacyAnalyticsPre']}{' '}
                <Text style={styles.link} onPress={() => Linking.openURL('https://clarity.microsoft.com/')}>
                  Microsoft Clarity
                </Text>{' '}
                {t['settings.privacyAnalyticsMid']}{' '}
                <Text style={styles.link} onPress={() => Linking.openURL('https://privacy.microsoft.com/privacystatement')}>
                  {t['settings.privacyMSPrivacy']}
                </Text>
                .
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.privacyFooter}>{t['settings.privacyFooter']}</Text>
      </View>
    </View>
  );
}
