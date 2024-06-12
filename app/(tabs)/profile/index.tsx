import { StyleSheet, Text, Image, View } from 'react-native';
import BowCard from './components/bowCard/BowCard';

export default function Profile() {
  return (
    <View style={styles.container}>
      <BowCard name="Bue" description="Un arco muy bonito" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 32,
  },
});
