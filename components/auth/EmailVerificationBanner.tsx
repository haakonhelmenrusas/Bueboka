import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/styles/colors';
import { useAuth } from '@/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faExclamationCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function EmailVerificationBanner() {
  const { user, resendVerificationEmail } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);

  // Don't show if user is verified, not logged in, or banner is dismissed
  if (!user || user.emailVerified || dismissed) {
    return null;
  }

  const handleResend = async () => {
    try {
      setSending(true);
      await resendVerificationEmail();
      alert('Verification email sent! Check your inbox.');
    } catch (error: any) {
      console.error('Resend verification email error:', error);
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to send verification email. Please try again.';
      alert(errorMessage);
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.banner}>
      <View style={styles.content}>
        <FontAwesomeIcon icon={faExclamationCircle} size={18} color={colors.white} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.text}>E-posten din er ikke bekreftet.</Text>
          <TouchableOpacity onPress={handleResend} disabled={sending}>
            <Text style={styles.link}>{sending ? 'Sender...' : 'Send bekreftelse på nytt'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => setDismissed(true)} style={styles.closeButton}>
        <FontAwesomeIcon icon={faTimes} size={14} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#f59e0b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  link: {
    color: colors.white,
    fontSize: 12,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});
