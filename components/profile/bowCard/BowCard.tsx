import { Text, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Bow } from '@/types';
import { styles } from './BowCardStyles';
import { colors } from '@/styles/colors';
import { capitalizeFirstLetter } from '@/utils';
import Svg, { Path } from 'react-native-svg';

interface Props {
  bow: Bow;
  onPress: () => void;
}

function BowIcon({ fill = colors.primary, width = 64, height = 64 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 32 32">
      <Path
        d="M30.6956 0.0260342C31.3007 -0.128255 32.01 0.412759 32.01 1.03593C31.3187 3.5807 31.2286 6.63643 30.4872 9.12309C30.3048 9.73424 29.7257 10.1951 29.0885 9.87851C28.4073 9.53987 27.4034 8.03706 26.7141 7.54614H26.5157L11.2611 22.8088C10.8844 23.6263 12.6337 26.4897 11.6098 27.4575L7.24759 31.7976C4.56456 32.7614 4.96731 29.315 4.20989 27.758C3.22004 27.3813 2.02981 27.2691 1.05398 26.9124C-0.0661236 26.5017 -0.284533 25.3876 0.406763 24.4578C0.967815 23.7044 3.64684 21.0354 4.40626 20.4543C5.63457 19.5146 7.49205 20.6347 8.87264 20.805L9.16318 20.7148L24.4679 5.30193C24.0371 4.67074 22.3359 3.47049 22.0894 2.87538C21.7368 2.02178 22.404 1.62904 23.1093 1.4467C25.5319 0.819522 28.247 0.643191 30.6956 0.0260342Z"
        stroke={fill}
        strokeWidth="0.2"
        fill={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.20759 9.40567L11.9083 15.1544L9.1451 17.8976L0.362631 9.19728C-0.693349 7.45601 0.695255 5.51437 2.70703 6.15357C2.9575 6.23372 3.2801 6.53829 3.53257 6.48619C8.54397 3.186 15.5431 3.19001 20.5104 6.55432L17.647 9.38964C14.0303 7.55419 9.81035 7.53616 6.20759 9.40767V9.40567Z"
        stroke={fill}
        strokeWidth="0.2"
        fill={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M25.4637 11.5056C25.7142 11.5056 26.8704 14.1445 27.0166 14.5533C28.4253 18.4846 28.3031 22.7286 26.5999 26.5438C26.4235 26.9405 25.5579 28.3652 25.5279 28.5836C25.4958 28.816 25.7783 29.0625 25.8625 29.3089C26.5458 31.2866 24.3296 32.7774 22.7106 31.5612L14.1165 22.8709L16.8596 20.1077L22.6144 25.6601C24.4999 22.1154 24.4378 17.9136 22.6404 14.3529L25.4637 11.5056Z"
        stroke={fill}
        strokeWidth="0.2"
        fill={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function BowCard({ bow, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {bow.isFavorite && (
        <View style={styles.starContainer}>
          <FontAwesomeIcon icon={faStar} size={16} color={colors.warning} />
        </View>
      )}
      <View style={styles.image}>
        <BowIcon />
      </View>
      <Text style={styles.name}>{bow.bowName}</Text>
      <Text style={styles.type}>{capitalizeFirstLetter(bow.bowType)}</Text>
    </TouchableOpacity>
  );
}
