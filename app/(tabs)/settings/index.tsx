import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '@/components/settings/SettingsStyles';
import { Button } from '@/components/common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons/faRightFromBracket';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons/faCircleInfo';
import { colors } from '@/styles/colors';
import { useAuth } from '@/hooks';
import { useState } from 'react';
import AboutContent from '@/components/about/AboutContent';

export default function Settings() {
  const { logout, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

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

  if (showAbout) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <AboutContent />
          <View style={styles.section}>
            <Button type="outline" label="Tilbake til innstillinger" onPress={() => setShowAbout(false)} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Innstillinger</Text>

        {user && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Konto</Text>
            <View style={styles.infoCard}>
              <Text style={styles.label}>Navn</Text>
              <Text style={styles.value}>{user.name || 'Ikke angitt'}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.label}>E-post</Text>
              <Text style={styles.value}>{user.email || 'Ikke angitt'}</Text>
            </View>
            {user.club && (
              <View style={styles.infoCard}>
                <Text style={styles.label}>Klubb</Text>
                <Text style={styles.value}>{user.club}</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Om</Text>
          <Button
            type="outline"
            label="Om Bueboka"
            icon={<FontAwesomeIcon icon={faCircleInfo} size={16} color={colors.primary} />}
            onPress={() => setShowAbout(true)}
          />
        </View>

        {user && (
          <View style={styles.section}>
            <Button
              variant="warning"
              label={isLoggingOut ? 'Logger ut...' : 'Logg ut'}
              disabled={isLoggingOut}
              loading={isLoggingOut}
              icon={<FontAwesomeIcon icon={faRightFromBracket} size={16} color={colors.white} />}
              onPress={handleLogout}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
