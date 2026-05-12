import { View } from 'react-native';
import { Input } from '@/components/common';
import { useTranslation } from '@/contexts';
import { styles } from './AuthStyles';

interface AuthFormProps {
  email: string;
  password: string;
  isLoading: boolean;
  onEmailChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
}

export default function AuthForm({ email, password, isLoading, onEmailChange, onPasswordChange }: AuthFormProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.form}>
      <Input
        label={t['auth.emailLabel']}
        value={email}
        onChangeText={onEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
        labelStyle={styles.whiteLabel}
      />
      <Input
        label={t['auth.passwordLabel']}
        value={password}
        onChangeText={onPasswordChange}
        secureTextEntry
        autoCapitalize="none"
        editable={!isLoading}
        labelStyle={styles.whiteLabel}
      />
    </View>
  );
}
