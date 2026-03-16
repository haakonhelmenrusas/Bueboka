import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFeather } from '@fortawesome/free-solid-svg-icons/faFeather';
import { Image } from 'expo-image';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './AboutStyles';
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons/faCrosshairs';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons/faExternalLink';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { colors } from '@/styles/colors';

export default function AboutContent() {
  const sponsor = require('../../assets/images/arcticBueLogo.png');
  const logo = require('../../assets/images/logo512.png');

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          contentFit="contain"
          source={logo}
          transition={200}
          placeholder={blurhash}
          accessibilityLabel="Bueboka Logo"
        />
        <Text style={styles.title}>Bueboka</Text>
        <Text style={styles.sub}>Bueboka er en tjeneste for alle bueskyttere i Norge.</Text>
      </View>

      {/* Migration Information Box */}
      <View style={styles.migrationBox}>
        <View style={styles.migrationHeader}>
          <FontAwesomeIcon icon={faInfoCircle} size={24} color="#856404" />
          <Text style={styles.migrationTitle}>Viktig melding</Text>
        </View>
        <Text style={styles.migrationText}>
          Denne mobilappen vil bli erstattet av en ny og forbedret versjon før sommeren 2026.
        </Text>
        <Text style={styles.migrationText}>
          For å bevare dine treningsdata og siktemerker, opprett en konto på vår nye nettside og legg dem inn der.
        </Text>
        <TouchableOpacity style={styles.migrationButton} onPress={() => Linking.openURL('https://bueboka.no')}>
          <Text style={styles.migrationButtonText}>Gå til bueboka.no</Text>
          <FontAwesomeIcon icon={faExternalLink} size={16} color="#856404" />
        </TouchableOpacity>
      </View>

      <View style={styles.box}>
        <View style={styles.featureItem}>
          <Text style={styles.text}>Lagre din bue og pilsett</Text>
          <FontAwesomeIcon style={styles.feather} icon={faFeather} />
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.text}>Beregne dine siktemerker</Text>
          <FontAwesomeIcon style={styles.feather} icon={faCrosshairs} />
        </View>
      </View>
      <View style={styles.linksCard}>
        <Text style={styles.linksTitle}>Besøk nettsiden</Text>
        <TouchableOpacity style={styles.link} onPress={() => Linking.openURL('https://bueboka.no')}>
          <Text style={{ color: colors.secondary }}>Bueboka.no</Text>
          <FontAwesomeIcon size={14} style={{ color: colors.secondary }} icon={faExternalLink} />
        </TouchableOpacity>
        <View style={styles.webInfoBox}>
          <Text style={styles.webInfoTitle}>Også tilgjengelig på web</Text>
          <Text style={styles.webInfoText}>Du kan bruke Bueboka i nettleseren din på samme konto: bueboka.no</Text>
        </View>
      </View>
      <View style={styles.sponsorCard}>
        <Text style={styles.sponsor}>Sponset av</Text>
        <Image
          style={styles.sponsorLogo}
          contentFit="contain"
          source={sponsor}
          transition={200}
          placeholder={blurhash}
          accessibilityLabel="Arctic Buesport AS Logo"
        />
      </View>
    </View>
  );
}
