import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/styles/colors';
import { Button, Message } from '@/components/common';
import { useAuth } from '@/hooks';
import { useTranslation } from '@/contexts';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

interface EmailVerificationProps {
  email: string;
  onVerified?: () => void;
  /**
   * Provided when the account has no session yet (the backend requires the
   * address to be verified before signing in). In that case the user cannot
   * check their own status from here, so they are sent back to the login form
   * once they have clicked the link in the email.
   */
  onBackToLogin?: () => void;
}

export default function EmailVerification({ email, onVerified, onBackToLogin }: EmailVerificationProps) {
  const { resendVerificationEmail, sendVerificationEmail, refreshUser, user, isLoading } = useAuth();
  const { t } = useTranslation();
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const handleResendEmail = async () => {
    if (cooldown > 0) return;

    try {
      setResending(true);
      setMessage(null);
      // Without a session the "resend for current user" endpoint has nobody to
      // resend for, so address the request explicitly.
      if (onBackToLogin) {
        await sendVerificationEmail(email);
      } else {
        await resendVerificationEmail();
      }
      setMessage({ type: 'success', text: t['emailVerification.sentSuccess'] });

      // Start cooldown
      setCooldown(60);
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || t['emailVerification.sendFailed'] });
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      await refreshUser();
      if (user?.emailVerified) {
        onVerified?.();
      } else {
        setMessage({ type: 'error', text: t['emailVerification.notVerifiedYet'] });
      }
    } catch {
      setMessage({ type: 'error', text: t['emailVerification.checkFailed'] });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FontAwesomeIcon icon={faEnvelope} size={64} color={colors.primary} />
      </View>

      <Text style={styles.title}>{t['emailVerification.title']}</Text>
      <Text style={styles.description}>
        {t['emailVerification.sentTo']} <Text style={styles.email}>{email}</Text>
      </Text>
      <Text style={styles.instructions}>
        {onBackToLogin ? t['emailVerification.instructionsSignIn'] : t['emailVerification.instructions']}
      </Text>

      {message && (
        <Message
          title={message.type === 'success' ? t['common.success'] : t['common.error']}
          description={message.text}
          onPress={() => setMessage(null)}
        />
      )}

      <View style={styles.buttonsContainer}>
        {onBackToLogin ? (
          <Button label={t['emailVerification.backToLogin']} onPress={onBackToLogin} buttonStyle={styles.primaryButton} />
        ) : (
          <Button
            label={t['emailVerification.checkButton']}
            onPress={handleCheckVerification}
            disabled={isLoading}
            buttonStyle={styles.primaryButton}
          />
        )}

        <Button
          label={cooldown > 0 ? `${t['emailVerification.resendCooldown']} (${cooldown}s)` : t['emailVerification.resendButton']}
          onPress={handleResendEmail}
          disabled={resending || isLoading || cooldown > 0}
          variant="standard"
          buttonStyle={styles.secondaryButton}
        />
      </View>

      {(isLoading || resending) && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>{resending ? t['emailVerification.sendingEmail'] : t['emailVerification.checkingStatus']}</Text>
        </View>
      )}

      <Text style={styles.helpText}>{t['emailVerification.helpText']}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background || '#f5f5f5',
  },
  iconContainer: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.primaryDark || '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  email: {
    fontWeight: '600',
    color: colors.primary,
  },
  instructions: {
    fontSize: 14,
    color: colors.dimmed || '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    marginBottom: 0,
  },
  secondaryButton: {
    marginBottom: 0,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: colors.dimmed || '#666',
  },
  helpText: {
    fontSize: 12,
    color: colors.inactive || '#999',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});
