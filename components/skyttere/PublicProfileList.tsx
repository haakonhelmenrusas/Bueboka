import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { PublicProfile } from '@/types';
import { styles } from './PublicProfileListStyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { colors } from '@/styles/colors';
import { hexToRgba } from '@/utils';
import { useTranslation } from '@/contexts';

interface Props {
  profiles: PublicProfile[];
  loading: boolean;
  searched: boolean;
  query: string;
}

export default function PublicProfileList({ profiles, loading, searched, query }: Props) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.white} />
        <Text style={styles.loadingText}>{t['skyttere.searching']}</Text>
      </View>
    );
  }

  if (searched && profiles.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <FontAwesomeIcon icon={faUser} size={48} color={hexToRgba(colors.white, 0.4)} />
        <Text style={styles.emptyTitle}>{t['skyttere.noResults']}</Text>
        <Text style={styles.emptySubtitle}>{t['skyttere.noResultsDesc'].replace('{query}', query)}</Text>
      </View>
    );
  }

  if (!searched || profiles.length === 0) {
    return null;
  }

  return (
    <View style={styles.listContent}>
      {profiles.map((profile, index) => (
        <View key={profile.id}>
          <ProfileCard profile={profile} />
          {index < profiles.length - 1 && <View style={styles.separator} />}
        </View>
      ))}
    </View>
  );
}

interface ProfileCardProps {
  profile: PublicProfile;
}

function ProfileCard({ profile }: ProfileCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const handlePress = () => {
    router.push(`/skyttere/${profile.id}`);
  };

  const displayName = profile.name ?? t['skyttere.anonymousArcher'];

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      android_ripple={{ color: hexToRgba(colors.primary, 0.1) }}>
      <View style={styles.avatarContainer}>
        {profile.image ? (
          <Image source={{ uri: profile.image }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <FontAwesomeIcon icon={faUser} size={24} color={colors.inactive} />
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardName}>{displayName}</Text>
        {profile.club && <Text style={styles.cardClub}>{profile.club}</Text>}
      </View>
    </Pressable>
  );
}
