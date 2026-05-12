import { View, Text } from 'react-native';
import { Button } from '@/components/common';
import { GoogleLogo } from '@/components/common/GoogleLogo/GoogleLogo';
import { useTranslation } from '@/contexts';
import { styles } from './AuthStyles';

interface SocialLoginProps {
  isLoading: boolean;
  onGoogleLogin: () => void;
}

export default function SocialLogin({ isLoading, onGoogleLogin }: SocialLoginProps) {
  const { t } = useTranslation();
  return (
    <>
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>{t['auth.divider']}</Text>
        <View style={styles.divider} />
      </View>
      <View style={styles.socialButtonsContainer}>
        <Button
          label={t['auth.loginWithGoogle']}
          onPress={onGoogleLogin}
          disabled={isLoading}
          variant="tertiary"
          icon={<GoogleLogo size={20} />}
          iconPosition="left"
        />
      </View>
    </>
  );
}
