import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

export default function About() {
  const logo = require('../../../assets/images/arcticBueLogo.png');

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>Hei!</Text>
      <Text style={styles.text}>
        Bueboka er en tjeneste for alle bueskyttere. Vi ønsker å gjøre det enklere for alle å finne informasjon om
        bueskyting. Her kan du bergene din egen score, finne informasjon om konkurranser og finne informasjon om klubber
        i Norge.
      </Text>
      <View style={{ marginTop: 'auto' }}>
        <Text style={styles.sponsor}>Sponsor</Text>
        <Image
          key={logo}
          style={styles.logo}
          contentFit="cover"
          source={logo}
          accessibilityLabel="Arctic Buesport AS Logo"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: '#000',
    fontSize: 28,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
  },
  sponsor: {
    fontSize: 26,
    textAlign: 'center',
  },
  logo: {
    width: '100%',
    height: 180,
  },
});
