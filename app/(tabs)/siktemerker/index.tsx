import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function Calculate() {
  return (
    <View>
      <Text style={styles.title}>Beregn siktemerker</Text>
      <View>
        <Text style={styles.label}>Avstand</Text>
        <TextInput
          placeholder="Antall"
          keyboardType="numeric"
          style={{ height: 40, paddingLeft: 8, borderColor: 'gray', borderWidth: 1 }}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    color: '#000',
    fontSize: 20,
    marginBottom: 16,
  },
  label: {
    color: '#000',
    fontSize: 16,
    marginBottom: 8,
  },
});
