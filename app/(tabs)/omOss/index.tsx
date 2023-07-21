import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

export default function About() {
  const logo = require('../../../assets/images/arcticBueLogo.png');

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hei!</Text>
      <Text style={styles.text}>
        Bueboka er en tjeneste for alle bueskyttere. Vi ønsker å gjøre det enklere for alle å finne informasjon om
        bueskyting. Her kan du bergene dine egne siktemerker, finne informasjon om konkurranser og finne informasjon om
        klubber i Norge.
      </Text>

      <Text style={styles.sponsor}>Sponsor</Text>
      <View style={styles.sponsorContainer}>
        <Image
          key={logo}
          style={styles.logo}
          contentFit="contain"
          source={logo}
          transition={500}
          placeholder={blurhash}
          accessibilityLabel="Arctic Buesport AS Logo"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'justify',
  },
  sponsorContainer: {
    marginTop: 'auto',
    width: 200,
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  sponsor: {
    fontSize: 26,
    textAlign: 'center',
  },
  logo: {
    flex: 1,
  },
});
