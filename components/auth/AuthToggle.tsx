import { Text, View } from 'react-native';
import { Button } from '@/components/common';
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
      <Text style={styles.togglePrompt}>{isLogin ? t['auth.noAccountPrompt'] : t['auth.hasAccountPrompt']}</Text>
      <Button
        label={isLogin ? t['auth.toggleToRegister'] : t['auth.toggleToLogin']}
        onPress={onToggle}
        disabled={isLoading}
        type="outline"
        buttonStyle={{ width: '100%' }}
        variant="tertiary"
      />
    </View>
  );
}
