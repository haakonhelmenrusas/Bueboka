import { View, Text } from 'react-native';
import { Button } from '@/components/common';
import { GoogleLogo } from '@/components/common/GoogleLogo/GoogleLogo';
import { styles } from './AuthStyles';

interface SocialLoginProps {
  isLoading: boolean;
  onGoogleLogin: () => void;
}

export default function SocialLogin({ isLoading, onGoogleLogin }: SocialLoginProps) {
  return (
    <>
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>eller</Text>
        <View style={styles.divider} />
      </View>
      <View style={styles.socialButtonsContainer}>
        <Button
          label="Fortsett med Google"
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
