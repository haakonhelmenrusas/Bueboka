import { ActivityIndicator, Image, Text, View } from 'react-native';
import { PublicProfile } from '@/types';
import { styles } from './PublicProfileListStyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { colors } from '@/styles/colors';
import { hexToRgba } from '@/utils';

interface Props {
  profiles: PublicProfile[];
  loading: boolean;
  searched: boolean;
  query: string;
}

export function PublicProfileList({ profiles, loading, searched, query }: Props) {
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.white} />
        <Text style={styles.loadingText}>Søker...</Text>
      </View>
    );
  }

  if (searched && profiles.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <FontAwesomeIcon icon={faUser} size={48} color={hexToRgba(colors.white, 0.4)} />
        <Text style={styles.emptyTitle}>Ingen resultater</Text>
        <Text style={styles.emptySubtitle}>Fant ingen bueskyttere som matcher &quot;{query}&quot;</Text>
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
  return (
    <View style={styles.card}>
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
        <Text style={styles.cardName}>{profile.name}</Text>
        {profile.club && <Text style={styles.cardClub}>{profile.club}</Text>}
      </View>
    </View>
  );
}
