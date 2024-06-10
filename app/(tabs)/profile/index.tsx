import { StyleSheet, Text, View } from 'react-native';

export default function Profile() {
  const logo = require('../../../assets/images/arcticBueLogo.png');

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hei skytter!</Text>
      <Text style={styles.text}>
        Velkommen til din profilside på Bueboka! Fyll inn din informasjon for å få en skreddersydd opplevelse som passer
        akkurat deg.
      </Text>
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
    fontWeight: 'medium',
    marginBottom: 16,
    marginTop: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
  },
});
