import { StyleSheet, Text, View } from 'react-native';

export default function Archery() {
  return (
    <View>
      <Text style={styles.title}>Bueskyting</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 16,
  },
  label: {
    color: '#000',
    fontSize: 16,
    marginBottom: 8,
  },
});
