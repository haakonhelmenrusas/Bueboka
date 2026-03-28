import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/styles/colors';
import { Button, Message } from '@/components/common';
import { useAuth } from '@/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

interface EmailVerificationProps {
  email: string;
  onVerified?: () => void;
}

export default function EmailVerification({ email, onVerified }: EmailVerificationProps) {
  const { resendVerificationEmail, refreshUser, user, isLoading } = useAuth();
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const handleResendEmail = async () => {
    if (cooldown > 0) return;

    try {
      setResending(true);
      setMessage(null);
      await resendVerificationEmail();
      setMessage({ type: 'success', text: 'Verification email sent! Check your inbox.' });

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
      setMessage({ type: 'error', text: error.message || 'Failed to resend email' });
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
        setMessage({ type: 'error', text: 'Email not verified yet. Please check your inbox.' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Failed to check verification status' });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FontAwesomeIcon icon={faEnvelope} size={64} color={colors.primary} />
      </View>

      <Text style={styles.title}>Bekreft e-postadressen din</Text>
      <Text style={styles.description}>
        Vi har sendt en bekreftelseslenke til <Text style={styles.email}>{email}</Text>
      </Text>
      <Text style={styles.instructions}>
        Klikk på lenken i e-posten for å bekrefte kontoen din. Når du har bekreftet, kan du komme tilbake hit og trykke på "Jeg har
        bekreftet".
      </Text>

      {message && (
        <Message title={message.type === 'success' ? 'Suksess' : 'Feil'} description={message.text} onPress={() => setMessage(null)} />
      )}

      <View style={styles.buttonsContainer}>
        <Button label="Jeg har bekreftet" onPress={handleCheckVerification} disabled={isLoading} buttonStyle={styles.primaryButton} />

        <Button
          label={cooldown > 0 ? `Send på nytt (${cooldown}s)` : 'Send e-post på nytt'}
          onPress={handleResendEmail}
          disabled={resending || isLoading || cooldown > 0}
          variant="standard"
          buttonStyle={styles.secondaryButton}
        />
      </View>

      {(isLoading || resending) && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>{resending ? 'Sender e-post...' : 'Sjekker status...'}</Text>
        </View>
      )}

      <Text style={styles.helpText}>Fikk du ikke e-posten? Sjekk søppelpostmappen din eller klikk "Send e-post på nytt".</Text>
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
