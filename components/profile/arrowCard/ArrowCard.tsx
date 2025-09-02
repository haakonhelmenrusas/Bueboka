import { Text, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { ArrowSet } from '@/types';
import { styles } from './ArrowCardStyles';
import { colors } from '@/styles/colors';
import Svg, { Path } from 'react-native-svg';

interface Props {
  arrowSet: ArrowSet;
  onPress: () => void;
}

function ArrowIcon({ fill = colors.primary, width = 40, height = 40 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 32 32">
      <Path
        d="M30.6956 0.0260342C31.3007 -0.128255 32.01 0.412759 32.01 1.03593C31.3187 3.5807 31.2286 6.63643 30.4872 9.12309C30.3048 9.73424 29.7257 10.1951 29.0885 9.87851C28.4073 9.53987 27.4034 8.03706 26.7141 7.54614H26.5157L11.2611 22.8088C10.8844 23.6263 12.6337 26.4897 11.6098 27.4575L7.24759 31.7976C4.56456 32.7614 4.96731 29.315 4.20989 27.758C3.22004 27.3813 2.02981 27.2691 1.05398 26.9124C-0.0661236 26.5017 -0.284533 25.3876 0.406763 24.4578C0.967815 23.7044 3.64684 21.0354 4.40626 20.4543C5.63457 19.5146 7.49205 20.6347 8.87264 20.805L9.16318 20.7148L24.4679 5.30193C24.0371 4.67074 22.3359 3.47049 22.0894 2.87538C21.7368 2.02178 22.404 1.62904 23.1093 1.4467C25.5319 0.819522 28.247 0.643191 30.6956 0.0260342Z"
        stroke={fill}
        strokeWidth="0.3"
        fill={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function ArrowCard({ arrowSet, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {arrowSet.isFavorite && (
        <View style={styles.starContainer}>
          <FontAwesomeIcon icon={faStar} size={16} color={colors.warning} />
        </View>
      )}
      <View style={styles.image}>
        <ArrowIcon />
      </View>
      <Text style={styles.name}>{arrowSet.name}</Text>
      <Text style={styles.type}>{arrowSet.material}</Text>
    </TouchableOpacity>
  );
}
