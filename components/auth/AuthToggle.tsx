import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from '@/contexts';
import { styles } from './AuthStyles';

interface AuthToggleProps {
  isLogin: boolean;
  isLoading: boolean;
  onToggle: () => void;
}

export default function AuthToggle({ isLogin, isLoading, onToggle }: AuthToggleProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.toggleContainer}>
      <TouchableOpacity onPress={onToggle} disabled={isLoading}>
        <Text style={styles.toggleLink}>{isLogin ? t['auth.toggleToRegister'] : t['auth.toggleToLogin']}</Text>
      </TouchableOpacity>
    </View>
  );
}
