import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { colors } from '@/styles/colors';
import { styles } from '@/components/settings/SettingsStyles';

export default function SponsorCard() {
  return (
    <View style={styles.sponsorCard}>
      <Text style={styles.sponsorLabel}>Sponset av</Text>
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
            Besøk nettsiden <FontAwesomeIcon icon={faExternalLink} size={14} color={colors.primary} />
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
