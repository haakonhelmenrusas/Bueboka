import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { colors } from '@/styles/colors';
import { styles } from '@/components/settings/SettingsStyles';
import { useTranslation } from '@/contexts';

export default function SponsorCard() {
  const { t } = useTranslation();

  return (
    <View style={styles.sponsorContent}>
      <Text style={styles.sponsorLabel}>{t['settings.sponsorLabel']}</Text>
      <Image
        style={styles.sponsorLogo}
        contentFit="contain"
        source={require('../../assets/images/arcticBueLogo.png')}
        transition={200}
        accessibilityLabel="Arctic Buesport AS"
      />
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => Linking.openURL('https://www.arcticbuesport.no?utm_source=bueboka&utm_medium=bueboka&utm_campaign=bueboka2026')}>
        <View style={styles.sponsorLink}>
          <Text>
            {t['settings.sponsorVisitWebsite']} <FontAwesomeIcon icon={faExternalLink} size={14} color={colors.primary} />
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
