import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';
import { PublicProfile } from '@/types';
import { styles } from './PublicProfileListStyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';

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
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Søker...</Text>
      </View>
    );
  }

  if (searched && profiles.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <FontAwesomeIcon icon={faUser} size={48} color="rgba(255, 255, 255, 0.4)" />
        <Text style={styles.emptyTitle}>Ingen resultater</Text>
        <Text style={styles.emptySubtitle}>Fant ingen bueskyttere som matcher &quot;{query}&quot;</Text>
      </View>
    );
  }

  if (!searched || profiles.length === 0) {
    return null;
  }

  return (
    <FlatList
      data={profiles}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ProfileCard profile={item} />}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    />
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
            <FontAwesomeIcon icon={faUser} size={24} color="#9697B6" />
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
