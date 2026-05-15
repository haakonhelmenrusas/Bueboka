import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons/faGlobe';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { Checkbox, Toggle } from '@/components/common';
import { styles } from '@/components/settings/SettingsStyles';
import { colors } from '@/styles/colors';
import { User } from '@/types';
import { userRepository } from '@/services/repositories';
import { useTranslation } from '@/contexts';

type FeedbackMsg = { type: 'success' | 'error'; text: string } | null;

interface PublicProfileSectionProps {
  user: User | null;
}

export default function PublicProfileSection({ user }: PublicProfileSectionProps) {
  const { t } = useTranslation();
  const [subOpen, setSubOpen] = useState(false);
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
      setPublicMsg({ type: 'success', text: t['settings.publicSaved'] });
      setTimeout(() => setPublicMsg(null), 3000);
    } catch {
      setPublicMsg({ type: 'error', text: t['settings.publicSaveError'] });
    } finally {
      setPublicSaving(false);
    }
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionTitleRow}>
        <FontAwesomeIcon icon={faGlobe} size={18} color="#fff" />
        <Text style={styles.sectionTitle}>{t['settings.publicProfileTitle']}</Text>
      </View>
      <View style={styles.sectionCard}>
        <Text style={styles.privacyIntro}>{t['settings.publicProfileIntro']}</Text>
        <Toggle value={isPublic} label={t['settings.makeProfilePublic']} onToggle={(v) => handlePublicSettingChange({ isPublic: v })} />
        {isPublic && (
          <View style={styles.publicSubSettings}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
              onPress={() => setSubOpen((prev) => !prev)}
              activeOpacity={0.7}>
              <Text style={styles.publicSubLabel}>{t['settings.choosePublicFields']}</Text>
              <FontAwesomeIcon
                icon={faChevronDown}
                size={11}
                color={colors.textSecondary}
                style={{ transform: [{ rotate: subOpen ? '180deg' : '0deg' }] }}
              />
            </TouchableOpacity>
            {subOpen && (
              <>
                <Checkbox
                  value={publicName}
                  label={t['settings.publicName']}
                  onChange={(v) => handlePublicSettingChange({ publicName: v })}
                  disabled={publicSaving}
                />
                <Checkbox
                  value={publicClub}
                  label={t['settings.publicClub']}
                  onChange={(v) => handlePublicSettingChange({ publicClub: v })}
                  disabled={publicSaving}
                />
                <Checkbox
                  value={publicSkytternr}
                  label={t['settings.publicArcherNumber']}
                  onChange={(v) => handlePublicSettingChange({ publicSkytternr: v })}
                  disabled={publicSaving}
                />
                <Checkbox
                  value={publicStats}
                  label={t['settings.publicStats']}
                  onChange={(v) => handlePublicSettingChange({ publicStats: v })}
                  disabled={publicSaving}
                />
                <Checkbox
                  value={publicAchievements}
                  label={t['settings.publicAchievements']}
                  onChange={(v) => handlePublicSettingChange({ publicAchievements: v })}
                  disabled={publicSaving}
                />
              </>
            )}
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
