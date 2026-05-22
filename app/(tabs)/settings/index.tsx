import { Alert, Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '@/components/settings/SettingsStyles';
import { Button } from '@/components/common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons/faRightFromBracket';
import { colors } from '@/styles/colors';
import { useAuth } from '@/hooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import ConfirmModal from '@/components/home/DeleteArrowSetModal/ConfirmModal';
import { userRepository } from '@/services/repositories';
import { AppError } from '@/services';
import { AccountSection, PublicProfileSection, PrivacySection, SponsorCard, LanguageSection, FeedbackModal } from '@/components/settings';
import { faComment } from '@fortawesome/free-solid-svg-icons/faComment';
import { EmailVerificationBanner } from '@/components/auth';
import { useTranslation } from '@/contexts';

export default function Settings() {
  const { logout, deleteAccount, user, refreshUser } = useAuth();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;

  const showFeedbackToast = useCallback(() => {
    toastOpacity.setValue(0);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2500),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [toastOpacity]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  async function handleProfileUpdate(data: { name: string; club?: string; skytternr?: string }) {
    try {
      await userRepository.updateProfile(data);
      await refreshUser();
    } catch (err) {
      if (err instanceof AppError) alert(err.message);
    }
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  }

  async function handleConfirmDelete() {
    setIsDeleting(true);
    try {
      await deleteAccount();
    } catch (error: any) {
      console.error('Error deleting account:', error);
      Alert.alert(t['common.error'], error?.message || t['settings.deleteError']);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primary, colors.secondary, '#1a4f66']} style={styles.gradient}>
        <View style={{ paddingTop: insets.top }}>
          <EmailVerificationBanner />
        </View>
        <ScrollView
          contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 92 }]}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{t['settings.title']}</Text>
          {user && <AccountSection user={user} onProfileUpdate={handleProfileUpdate} />}
          <PublicProfileSection user={user} />
          <LanguageSection />
          <View style={styles.sectionCard}>
            <Button
              variant="tertiary"
              label={t['settings.feedback']}
              buttonStyle={styles.logoutButton}
              textStyle={styles.logoutLabel}
              iconPosition="right"
              icon={<FontAwesomeIcon icon={faComment} size={16} color={colors.primary} />}
              onPress={() => setShowFeedback(true)}
            />
          </View>
          <PrivacySection />
          <View style={styles.sectionCard}>
            <SponsorCard />
            <View style={styles.cardDivider} />
            <Button
              variant="tertiary"
              label={isLoggingOut ? t['settings.loggingOut'] : t['settings.logout']}
              disabled={isLoggingOut}
              loading={isLoggingOut}
              buttonStyle={styles.logoutButton}
              textStyle={styles.logoutLabel}
              iconPosition="right"
              icon={<FontAwesomeIcon icon={faRightFromBracket} size={16} color={colors.primary} />}
              onPress={handleLogout}
            />
            <View style={styles.cardDivider} />
            <View style={styles.dangerSection}>
              <Text style={styles.dangerHeading}>{t['settings.deleteAccount']}</Text>
              <Text style={styles.dangerDescription}>{t['settings.deleteDescription']}</Text>
              <Button
                variant="warning"
                label={isDeleting ? t['settings.deletingAccount'] : t['settings.deleteAccount']}
                disabled={isDeleting || isLoggingOut}
                loading={isDeleting}
                onPress={() => setShowDeleteConfirm(true)}
              />
            </View>
          </View>
        </ScrollView>
      </LinearGradient>

      <Animated.View style={[toastStyles.toast, { opacity: toastOpacity, top: insets.top + 8 }]} pointerEvents="none">
        <Text style={toastStyles.toastText}>{t['feedback.thanks']}</Text>
      </Animated.View>
      <FeedbackModal visible={showFeedback} onClose={() => setShowFeedback(false)} onSubmitted={showFeedbackToast} />
      <ConfirmModal
        visible={showDeleteConfirm}
        title={t['settings.confirmDeleteTitle']}
        message={t['settings.confirmDeleteMessage']}
        confirmLabel={t['settings.confirmDeleteYes']}
        cancelLabel={t['common.cancel']}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
}

const toastStyles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 100,
  },
  toastText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
