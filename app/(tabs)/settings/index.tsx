import { Alert, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '@/components/settings/SettingsStyles';
import { Button, Checkbox } from '@/components/common';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons/faRightFromBracket';
import { faGlobe } from '@fortawesome/free-solid-svg-icons/faGlobe';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faBullseye } from '@fortawesome/free-solid-svg-icons/faBullseye';
import { faKey } from '@fortawesome/free-solid-svg-icons/faKey';
import { faShield } from '@fortawesome/free-solid-svg-icons/faShield';
import { faChartBar } from '@fortawesome/free-solid-svg-icons/faChartBar';
import { colors } from '@/styles/colors';
import { useAuth } from '@/hooks';
import { useEffect, useState } from 'react';
import EmailVerificationBanner from '@/components/auth/EmailVerificationBanner';
import ProfileBox from '@/components/home/profile/ProfileBox';
import ProfileForm from '@/components/home/profileForm/ProfileForm';
import ConfirmModal from '@/components/home/DeleteArrowSetModal/ConfirmModal';
import { userRepository } from '@/services/repositories';
import { AppError } from '@/services';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons';

type FeedbackMsg = { type: 'success' | 'error'; text: string } | null;

export default function Settings() {
  const { logout, deleteAccount, user, refreshUser } = useAuth();
  const insets = useSafeAreaInsets();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Public profile settings – initialised from user once loaded
  const [isPublic, setIsPublic] = useState(false);
  const [publicName, setPublicName] = useState(true);
  const [publicClub, setPublicClub] = useState(true);
  const [publicStats, setPublicStats] = useState(false);
  const [publicSkytternr, setPublicSkytternr] = useState(false);
  const [publicAchievements, setPublicAchievements] = useState(false);
  const [publicSaving, setPublicSaving] = useState(false);
  const [publicMsg, setPublicMsg] = useState<FeedbackMsg>(null);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Sync local state whenever the user object changes
  useEffect(() => {
    if (!user) return;
    setIsPublic(user.isPublic ?? false);
    setPublicName(user.publicName ?? true);
    setPublicClub(user.publicClub ?? true);
    setPublicStats(user.publicStats ?? false);
    setPublicSkytternr(user.publicSkytternr ?? false);
    setPublicAchievements(user.publicAchievements ?? false);
  }, [user]);

  async function handlePublicSettingChange(
    updates: Partial<{
      isPublic: boolean;
      publicName: boolean;
      publicClub: boolean;
      publicStats: boolean;
      publicSkytternr: boolean;
      publicAchievements: boolean;
    }>,
  ) {
    setPublicSaving(true);
    setPublicMsg(null);

    // Optimistic local update
    if (updates.isPublic !== undefined) setIsPublic(updates.isPublic);
    if (updates.publicName !== undefined) setPublicName(updates.publicName);
    if (updates.publicClub !== undefined) setPublicClub(updates.publicClub);
    if (updates.publicStats !== undefined) setPublicStats(updates.publicStats);
    if (updates.publicSkytternr !== undefined) setPublicSkytternr(updates.publicSkytternr);
    if (updates.publicAchievements !== undefined) setPublicAchievements(updates.publicAchievements);

    try {
      await userRepository.updatePublicSettings(updates);
      setPublicMsg({ type: 'success', text: 'Innstillinger lagret' });
      setTimeout(() => setPublicMsg(null), 3000);
    } catch {
      setPublicMsg({ type: 'error', text: 'Kunne ikke lagre innstillinger' });
    } finally {
      setPublicSaving(false);
    }
  }

  async function handleProfileUpdate(data: { name: string; club?: string; skytternr?: string }) {
    try {
      await userRepository.updateProfile(data);
      await refreshUser();
    } catch (err) {
      if (err instanceof AppError) alert(err.message);
    }
  }

  async function handleAvatarUpload(uri: string) {
    try {
      await userRepository.updateAvatar(uri);
      await refreshUser();
    } catch (err) {
      const message = err instanceof AppError ? err.message : 'Kunne ikke laste opp bilde. Prøv igjen.';
      Alert.alert('Feil', message);
    }
  }

  async function handleAvatarRemove() {
    try {
      await userRepository.removeAvatar();
      await refreshUser();
    } catch (err) {
      const message = err instanceof AppError ? err.message : 'Kunne ikke fjerne bilde. Prøv igjen.';
      Alert.alert('Feil', message);
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
          {user && (
            <ProfileBox
              user={user}
              avatarUrl={user.image || undefined}
              onEdit={() => setIsProfileModalVisible(true)}
              onAvatarUpload={handleAvatarUpload}
              onAvatarRemove={handleAvatarRemove}
            />
          )}
          {user && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Konto</Text>
              <View style={styles.sectionCard}>
                <View style={styles.infoGrid}>
                  <View style={styles.infoGridItem}>
                    <Text style={styles.label}>Navn</Text>
                    <Text style={styles.value}>{user.name ?? '—'}</Text>
                  </View>
                  <View style={styles.infoGridItem}>
                    <Text style={styles.label}>E-post</Text>
                    <Text style={styles.value} numberOfLines={1}>
                      {user.email}
                    </Text>
                  </View>
                  <View style={styles.infoGridItem}>
                    <Text style={styles.label}>Klubb</Text>
                    <Text style={styles.value}>{user.club ?? '—'}</Text>
                  </View>
                  <View style={styles.infoGridItem}>
                    <Text style={styles.label}>Skytternummer</Text>
                    <Text style={styles.value}>{user.skytternr ?? '—'}</Text>
                  </View>
                </View>
                <View style={styles.editButtonRow}>
                  <Button
                    type="outline"
                    label="Rediger profil"
                    onPress={() => setIsProfileModalVisible(true)}
                    icon={<FontAwesomeIcon icon={faPen} size={13} color={colors.primary} />}
                    iconPosition="left"
                  />
                </View>
              </View>
            </View>
          )}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <FontAwesomeIcon icon={faGlobe} size={18} color={colors.white} />
              <Text style={styles.sectionTitle}>Offentlig profil</Text>
            </View>
            <View style={styles.sectionCard}>
              <Text style={styles.privacyIntro}>Gjør profilen din søkbar for andre brukere. Du velger selv hva du ønsker å dele.</Text>
              <Checkbox
                value={isPublic}
                label="Gjør profilen min offentlig"
                onChange={(v) => handlePublicSettingChange({ isPublic: v })}
                disabled={publicSaving}
              />
              {isPublic && (
                <View style={styles.publicSubSettings}>
                  <Text style={styles.publicSubLabel}>Velg hva som vises offentlig:</Text>
                  <Checkbox
                    value={publicName}
                    label="Navn"
                    onChange={(v) => handlePublicSettingChange({ publicName: v })}
                    disabled={publicSaving}
                  />
                  <Checkbox
                    value={publicClub}
                    label="Klubb"
                    onChange={(v) => handlePublicSettingChange({ publicClub: v })}
                    disabled={publicSaving}
                  />
                  <Checkbox
                    value={publicSkytternr}
                    label="Skytternummer"
                    onChange={(v) => handlePublicSettingChange({ publicSkytternr: v })}
                    disabled={publicSaving}
                  />
                  <Checkbox
                    value={publicStats}
                    label="Statistikk (totalt antall piler og snittpoeng)"
                    onChange={(v) => handlePublicSettingChange({ publicStats: v })}
                    disabled={publicSaving}
                  />
                  <Checkbox
                    value={publicAchievements}
                    label="Prestasjoner (antall oppnådde prestasjoner)"
                    onChange={(v) => handlePublicSettingChange({ publicAchievements: v })}
                    disabled={publicSaving}
                  />
                </View>
              )}
              {publicMsg && (
                <View style={publicMsg.type === 'success' ? styles.successMessage : styles.errorMessage}>
                  <Text style={publicMsg.type === 'success' ? styles.successMessageText : styles.errorMessageText}>{publicMsg.text}</Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personvern og datasikkerhet</Text>
            <View style={styles.sectionCard}>
              <Text style={styles.privacyIntro}>
                Dine data er trygge hos oss. Vi tar personvern på alvor og forplikter oss til å beskytte informasjonen din.
              </Text>
              <View style={styles.privacyList}>
                {[
                  {
                    icon: faLock,
                    title: 'Aldri delt eller solgt',
                    desc: 'Vi deler eller selger aldri dataene dine til tredjeparter. Din informasjon forblir privat.',
                  },
                  {
                    icon: faBullseye,
                    title: 'Kun til appens drift',
                    desc: 'Vi bruker kun dataene dine til å drive appen og gi deg den beste brukeropplevelsen.',
                  },
                  {
                    icon: faKey,
                    title: 'Din kontroll',
                    desc: 'Du kan når som helst slette kontoen din og all tilhørende data.',
                  },
                  {
                    icon: faShield,
                    title: 'Sikker lagring',
                    desc: 'All data krypteres og lagres sikkert i samsvar med moderne sikkerhetsstandarder.',
                  },
                ].map(({ icon, title, desc }) => (
                  <View key={title} style={styles.privacyItem}>
                    <View style={styles.privacyIconWrap}>
                      <FontAwesomeIcon icon={icon} size={15} color={colors.primary} />
                    </View>
                    <View style={styles.privacyItemContent}>
                      <Text style={styles.privacyItemTitle}>{title}</Text>
                      <Text style={styles.privacyItemDesc}>{desc}</Text>
                    </View>
                  </View>
                ))}
                <View style={styles.privacyItem}>
                  <View style={styles.privacyIconWrap}>
                    <FontAwesomeIcon icon={faChartBar} size={15} color={colors.primary} />
                  </View>
                  <View style={styles.privacyItemContent}>
                    <Text style={styles.privacyItemTitle}>Analyse og forbedring</Text>
                    <Text style={styles.privacyItemDesc}>
                      Vi bruker{' '}
                      <Text style={styles.link} onPress={() => Linking.openURL('https://clarity.microsoft.com/')}>
                        Microsoft Clarity
                      </Text>{' '}
                      for å forstå hvordan appen brukes og forbedre brukeropplevelsen. Les mer i{' '}
                      <Text style={styles.link} onPress={() => Linking.openURL('https://privacy.microsoft.com/privacystatement')}>
                        Microsofts personvernerklæring
                      </Text>
                      .
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={styles.privacyFooter}>
                Hvis du har spørsmål om hvordan vi håndterer dataene dine, ta gjerne kontakt med oss.
              </Text>
            </View>
          </View>
          <View style={styles.sponsorCard}>
            <Text style={styles.sponsorLabel}>Sponset av</Text>
            <Image
              style={styles.sponsorLogo}
              contentFit="contain"
              source={require('../../../assets/images/arcticBueLogo.png')}
              transition={200}
              accessibilityLabel="Arctic Buesport AS"
            />
            <TouchableOpacity activeOpacity={0.75} onPress={() => Linking.openURL('https://arcticbuesport.no')}>
              <View style={styles.sponsorLink}>
                <Text>
                  Besøk nettsiden <FontAwesomeIcon icon={faExternalLink} size={14} color={colors.primary} />
                </Text>
              </View>
            </TouchableOpacity>
          </View>
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

      {user && (
        <ProfileForm
          modalVisible={isProfileModalVisible}
          setModalVisible={setIsProfileModalVisible}
          user={user}
          onSave={async (data) => {
            await handleProfileUpdate(data);
          }}
        />
      )}

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
