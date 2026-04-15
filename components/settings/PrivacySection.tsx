import { Linking, Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faBullseye } from '@fortawesome/free-solid-svg-icons/faBullseye';
import { faKey } from '@fortawesome/free-solid-svg-icons/faKey';
import { faShield } from '@fortawesome/free-solid-svg-icons/faShield';
import { faChartBar } from '@fortawesome/free-solid-svg-icons/faChartBar';
import { colors } from '@/styles/colors';
import { styles } from '@/components/settings/SettingsStyles';

const privacyItems = [
  {
    icon: faLock,
    title: 'Aldri delt eller solgt',
    desc: 'Vi deler eller selger aldri dataene dine til tredjeparter. Din informasjon forblir privat.',
  },
  {
    icon: faBullseye,
    title: 'Kun til appens drift',
    desc: 'Vi bruker kun dataene dine til å drive appen og gi deg den beste brukeropplevelsen.',
  },
  {
    icon: faKey,
    title: 'Din kontroll',
    desc: 'Du kan når som helst slette kontoen din og all tilhørende data.',
  },
  {
    icon: faShield,
    title: 'Sikker lagring',
    desc: 'All data krypteres og lagres sikkert i samsvar med moderne sikkerhetsstandarder.',
  },
];

export default function PrivacySection() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Personvern og datasikkerhet</Text>
      <View style={styles.sectionCard}>
        <Text style={styles.privacyIntro}>
          Dine data er trygge hos oss. Vi tar personvern på alvor og forplikter oss til å beskytte informasjonen din.
        </Text>
        <View style={styles.privacyList}>
          {privacyItems.map(({ icon, title, desc }) => (
            <View key={title} style={styles.privacyItem}>
              <View style={styles.privacyIconWrap}>
                <FontAwesomeIcon icon={icon} size={15} color={colors.primary} />
              </View>
              <View style={styles.privacyItemContent}>
                <Text style={styles.privacyItemTitle}>{title}</Text>
                <Text style={styles.privacyItemDesc}>{desc}</Text>
              </View>
            </View>
          ))}
          <View style={styles.privacyItem}>
            <View style={styles.privacyIconWrap}>
              <FontAwesomeIcon icon={faChartBar} size={15} color={colors.primary} />
            </View>
            <View style={styles.privacyItemContent}>
              <Text style={styles.privacyItemTitle}>Analyse og forbedring</Text>
              <Text style={styles.privacyItemDesc}>
                Vi bruker{' '}
                <Text style={styles.link} onPress={() => Linking.openURL('https://clarity.microsoft.com/')}>
                  Microsoft Clarity
                </Text>{' '}
                for å forstå hvordan appen brukes og forbedre brukeropplevelsen. Les mer i{' '}
                <Text style={styles.link} onPress={() => Linking.openURL('https://privacy.microsoft.com/privacystatement')}>
                  Microsofts personvernerklæring
                </Text>
                .
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.privacyFooter}>Hvis du har spørsmål om hvordan vi håndterer dataene dine, ta gjerne kontakt med oss.</Text>
      </View>
    </View>
  );
}
