import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '@/components/settings/SettingsStyles';
import { Button } from '@/components/common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons/faRightFromBracket';
import { colors } from '@/styles/colors';
import { useAuth } from '@/hooks';
import { useState } from 'react';
import AboutContent from '@/components/about/AboutContent';
import EmailVerificationBanner from '@/components/auth/EmailVerificationBanner';

export default function Settings() {
  const { logout, deleteAccount, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logg ut', 'Er du sikker på at du vil logge ut?', [
      {
        text: 'Avbryt',
        style: 'cancel',
      },
      {
        text: 'Logg ut',
        style: 'destructive',
        onPress: async () => {
          setIsLoggingOut(true);
          try {
            await logout();
            // Navigation will be handled by auth state change
          } catch (error) {
            console.error('Error logging out:', error);
            Alert.alert('Feil', 'Kunne ikke logge ut. Prøv igjen.');
          } finally {
            setIsLoggingOut(false);
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Slett konto',
      'Er du sikker på at du vil slette kontoen din? Dette kan ikke angres og alle dine data vil bli permanent slettet.',
      [
        {
          text: 'Avbryt',
          style: 'cancel',
        },
        {
          text: 'Slett konto',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteAccount();
              // Navigation will be handled by auth state change
            } catch (error: any) {
              console.error('Error deleting account:', error);
              Alert.alert('Feil', error?.message || 'Kunne ikke slette konto. Prøv igjen.');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <EmailVerificationBanner />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Innstillinger</Text>
        {user && (
          <View style={styles.section}>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Konto</Text>
              <View style={styles.infoCard}>
                <Text style={styles.label}>Navn</Text>
                <Text style={styles.value}>{user.name || 'Ikke angitt'}</Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.label}>E-post</Text>
                <Text style={styles.value}>{user.email || 'Ikke angitt'}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionCard}>
            <AboutContent />
          </View>
        </View>

        {user && (
          <View style={styles.section}>
            <View style={styles.sectionCard}>
              <Button
                variant="warning"
                label={isLoggingOut ? 'Logger ut...' : 'Logg ut'}
                disabled={isLoggingOut}
                loading={isLoggingOut}
                buttonStyle={styles.logoutButton}
                textStyle={styles.logoutLabel}
                icon={<FontAwesomeIcon icon={faRightFromBracket} size={16} color={colors.white} />}
                onPress={handleLogout}
              />
            </View>
          </View>
        )}

        {user && (
          <View style={styles.section}>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Farlig sone</Text>
              <Button
                variant="warning"
                label={isDeleting ? 'Sletter konto...' : 'Slett konto'}
                disabled={isDeleting || isLoggingOut}
                loading={isDeleting}
                onPress={handleDeleteAccount}
              />
              <Text style={styles.dangerText}>Dette vil permanent slette kontoen din og alle tilknyttede data. Dette kan ikke angres.</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
