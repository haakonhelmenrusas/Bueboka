import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './AuthStyles';

interface AuthToggleProps {
  isLogin: boolean;
  isLoading: boolean;
  onToggle: () => void;
}

export default function AuthToggle({ isLogin, isLoading, onToggle }: AuthToggleProps) {
  return (
    <View style={styles.toggleContainer}>
      <TouchableOpacity onPress={onToggle} disabled={isLoading}>
        <Text style={styles.toggleLink}>{isLogin ? 'Registrer deg' : 'Logg inn'}</Text>
      </TouchableOpacity>
    </View>
  );
}
