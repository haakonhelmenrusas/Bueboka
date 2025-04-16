import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFeather } from '@fortawesome/free-solid-svg-icons/faFeather';
import { Image } from 'expo-image';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '@/components/about/AboutStyles';

export default function About() {
  const sponsor = require('../../../assets/images/arcticBueLogo.png');
  const logo = require('../../../assets/images/logo512.png');

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
      <View style={styles.box}>
        <Text style={styles.text}>Beregne dine siktemerker</Text>
        <FontAwesomeIcon style={styles.feather} icon={faFeather} />
      </View>
      <View style={styles.links}>
        <Text>Se prosjekt og koden bak på </Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://github.com/haakonhelmenrusas/Bueboka/discussions')}>
          <Text style={styles.link}>GitHub</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.sponsorContainer}>
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
      </ScrollView>
    </View>
  );
}
