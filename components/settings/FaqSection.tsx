import { Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons/faArrowUpRightFromSquare';
import { Button } from '@/components/common';
import { colors } from '@/styles/colors';
import { styles } from '@/components/settings/SettingsStyles';
import { useTranslation } from '@/contexts';

export const FAQ_URL = 'https://bueboka.no/faq';

export default function FaqSection() {
  const { t } = useTranslation();

  // Open in an in-app browser window so the user stays in the app
  const openFaq = () => {
    void WebBrowser.openBrowserAsync(FAQ_URL);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t['settings.faqTitle']}</Text>
      <View style={styles.sectionCard}>
        <Text style={styles.faqDesc}>{t['settings.faqDesc']}</Text>
        <Button
          variant="tertiary"
          label={t['settings.faqButton']}
          iconPosition="right"
          icon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} size={14} color={colors.primary} />}
          onPress={openFaq}
        />
      </View>
    </View>
  );
}
