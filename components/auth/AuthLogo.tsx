import { View, Text, Image } from 'react-native';
import { styles } from './AuthStyles';

export default function AuthLogo() {
  return (
    <View style={styles.logoContainer}>
      <Text style={styles.appTitle}>Bueboka</Text>
      <Image source={require('../../assets/images/logo-main-dark.png')} style={styles.logo} resizeMode="contain" />
    </View>
  );
}
