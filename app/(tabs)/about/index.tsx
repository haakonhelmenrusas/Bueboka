import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFeather } from '@fortawesome/free-solid-svg-icons/faFeather';
import { Image } from 'expo-image';
import { StyleSheet, Text, View, Linking, TouchableOpacity, ScrollView } from 'react-native';

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
        <TouchableOpacity onPress={() => Linking.openURL('https://github.com/haakonhelmenrusas/Bueboka/discussions')}>
          <Text style={styles.link}>GitHub</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/profile.php?id=61560373960234')}>
          <Text style={styles.link}>Facebook</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
  },
  header: {
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D8F5FF',
    margin: -16,
    paddingTop: 24,
    marginTop: -32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 32,
  },
  sub: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 32,
    marginBottom: 16,
  },
  box: {
    backgroundColor: '#053546',
    borderRadius: 10,
    padding: 24,
    textAlign: 'center',
  },
  feather: {
    color: '#fff',
    fontSize: 32,
    alignSelf: 'center',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 16,
  },
  links: {
    marginTop: 32,
    marginBottom: 32,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  link: {
    fontSize: 16,
    color: 'blue',
  },
  sponsorContainer: {
    flexDirection: 'column',
    marginTop: 'auto',
    alignItems: 'center',
  },
  sponsor: {
    fontSize: 14,
    color: '#227B9A',
    textAlign: 'center',
  },
  logo: {
    height: 150,
    width: 150,
  },
  sponsorLogo: {
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 80,
    width: 250,
  },
});
