import { Alert, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '@/components/settings/SettingsStyles';
import { Button } from '@/components/common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons/faRightFromBracket';
import { colors } from '@/styles/colors';
import { useAuth } from '@/hooks';
import { useEffect, useState } from 'react';
import EmailVerificationBanner from '@/components/auth/EmailVerificationBanner';
import ConfirmModal from '@/components/home/DeleteArrowSetModal/ConfirmModal';
import { userRepository } from '@/services/repositories';
import { AppError } from '@/services';
import { AccountSection, PublicProfileSection, PrivacySection, SponsorCard } from '@/components/settings';

export default function Settings() {
  const { logout, deleteAccount, user, refreshUser } = useAuth();
  const insets = useSafeAreaInsets();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
      Alert.alert('Feil', error?.message || 'Kunne ikke slette konto. Prøv igjen.');
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
        <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Innstillinger</Text>
          {user && <AccountSection user={user} onProfileUpdate={handleProfileUpdate} />}
          <PublicProfileSection user={user} />
          <PrivacySection />
          <SponsorCard />
          <Button
            variant="tertiary"
            label={isLoggingOut ? 'Logger ut...' : 'Logg ut'}
            disabled={isLoggingOut}
            loading={isLoggingOut}
            buttonStyle={styles.logoutButton}
            textStyle={styles.logoutLabel}
            iconPosition="right"
            icon={<FontAwesomeIcon icon={faRightFromBracket} size={16} color={colors.primary} />}
            onPress={handleLogout}
          />
          <View style={styles.dangerCard}>
            <Text style={styles.dangerHeading}>Slett konto</Text>
            <Text style={styles.dangerDescription}>
              Når du sletter kontoen din, vil alle dine data bli permanent fjernet. Dette inkluderer treningsøkter, utstyr og
              profilinformasjon. Denne handlingen kan ikke angres.
            </Text>
            <Button
              variant="warning"
              label={isDeleting ? 'Sletter konto...' : 'Slett konto'}
              disabled={isDeleting || isLoggingOut}
              loading={isDeleting}
              onPress={() => setShowDeleteConfirm(true)}
            />
          </View>
        </ScrollView>
      </LinearGradient>

      <ConfirmModal
        visible={showDeleteConfirm}
        title="Bekreft sletting av konto"
        message="Er du sikker på at du vil slette kontoen din? Alle dine data vil bli permanent fjernet, inkludert treningsøkter, utstyr og profilinformasjon. Denne handlingen kan ikke angres."
        confirmLabel="Ja, slett konto"
        cancelLabel="Avbryt"
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
}
