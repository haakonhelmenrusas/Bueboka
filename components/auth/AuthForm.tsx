import { View } from 'react-native';
import { Input } from '@/components/common';
import { styles } from './AuthStyles';

interface AuthFormProps {
  email: string;
  password: string;
  isLoading: boolean;
  onEmailChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
}

export default function AuthForm({ email, password, isLoading, onEmailChange, onPasswordChange }: AuthFormProps) {
  return (
    <View style={styles.form}>
      <Input
        label="E-post"
        value={email}
        onChangeText={onEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
        labelStyle={styles.whiteLabel}
      />
      <Input
        label="Passord"
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
