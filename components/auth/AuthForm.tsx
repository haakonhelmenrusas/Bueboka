import { View } from 'react-native';
import { Input } from '@/components/common';
import { styles } from './AuthStyles';

interface AuthFormProps {
  isLogin: boolean;
  email: string;
  password: string;
  name: string;
  isLoading: boolean;
  onEmailChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  onNameChange: (text: string) => void;
}

export default function AuthForm({
  isLogin,
  email,
  password,
  name,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onNameChange,
}: AuthFormProps) {
  return (
    <View style={styles.form}>
      {!isLogin && (
        <Input
          label="Navn"
          value={name}
          onChangeText={onNameChange}
          editable={!isLoading}
          placeholder="Navn"
          labelStyle={styles.whiteLabel}
          autoCapitalize="words"
        />
      )}
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
