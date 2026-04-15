import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons/faGlobe';
import { Checkbox } from '@/components/common';
import { styles } from '@/components/settings/SettingsStyles';
import { User } from '@/types';
import { userRepository } from '@/services/repositories';

type FeedbackMsg = { type: 'success' | 'error'; text: string } | null;

interface PublicProfileSectionProps {
  user: User | null;
}

export default function PublicProfileSection({ user }: PublicProfileSectionProps) {
  const [isPublic, setIsPublic] = useState(false);
  const [publicName, setPublicName] = useState(true);
  const [publicClub, setPublicClub] = useState(true);
  const [publicStats, setPublicStats] = useState(false);
  const [publicSkytternr, setPublicSkytternr] = useState(false);
  const [publicAchievements, setPublicAchievements] = useState(false);
  const [publicSaving, setPublicSaving] = useState(false);
  const [publicMsg, setPublicMsg] = useState<FeedbackMsg>(null);

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

  return (
    <View style={styles.section}>
      <View style={styles.sectionTitleRow}>
        <FontAwesomeIcon icon={faGlobe} size={18} color="#fff" />
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
  );
}
