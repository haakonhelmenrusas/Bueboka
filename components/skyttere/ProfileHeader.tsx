import { View, Text, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBuilding, faHashtag } from '@fortawesome/free-solid-svg-icons';
import { faUser as faUserRegular } from '@fortawesome/free-regular-svg-icons';
import { colors } from '@/styles/colors';
import { hexToRgba } from '@/utils';
import { styles } from './PublicProfileDetailStyles';
import { useTranslation } from '@/contexts';

interface ProfileHeaderProps {
  name: string | null;
  image?: string | null;
  club?: string | null;
  skytternr?: string | null;
}

export default function ProfileHeader({ name, image, club, skytternr }: ProfileHeaderProps) {
  const { t } = useTranslation();
  return (
    <>
      <View style={styles.avatarWrap}>
        {image ? (
          <Image source={{ uri: image }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <FontAwesomeIcon icon={faUserRegular} size={40} color={hexToRgba(colors.primary, 0.3)} />
          </View>
        )}
      </View>

      <Text style={styles.name}>{name || t['skyttere.unknownName']}</Text>

      {(club || skytternr) && (
        <View style={styles.badges}>
          {club && (
            <View style={styles.clubBadge}>
              <FontAwesomeIcon icon={faBuilding} size={13} color={colors.primary} />
              <Text style={styles.badgeText}>{club}</Text>
            </View>
          )}
          {skytternr && (
            <View style={styles.skytternrBadge}>
              <FontAwesomeIcon icon={faHashtag} size={13} color={colors.primary} />
              <Text style={styles.badgeText}>{skytternr}</Text>
            </View>
          )}
        </View>
      )}
    </>
  );
}
