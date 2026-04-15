import { View, Text, Animated, TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faUsers } from '@fortawesome/free-solid-svg-icons';
import { colors } from '@/styles/colors';
import { hexToRgba } from '@/utils';
import { styles } from './SkyttereStyles';

interface SearchHeroProps {
  query: string;
  onQueryChange: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  animatedSearchStyle: any;
}

export default function SearchHero({ query, onQueryChange, onFocus, onBlur, animatedSearchStyle }: SearchHeroProps) {
  return (
    <View style={styles.hero}>
      <View style={styles.heroIcon}>
        <FontAwesomeIcon icon={faUsers} size={36} color={colors.white} />
      </View>
      <Text style={styles.title}>Finn bueskyttere</Text>
      <Text style={styles.subtitle}>
        Søk blant bueskyttere som har valgt å dele profilen sin med andre Bueboka-skyttere. Det er kun registrerte brukere som kan søke.
      </Text>
      <Animated.View style={[styles.searchWrap, animatedSearchStyle]}>
        <View style={styles.searchIcon}>
          <FontAwesomeIcon icon={faSearch} size={20} color={hexToRgba(colors.white, 0.5)} />
        </View>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={onQueryChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="Søk etter navn eller klubb…"
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          placeholderTextColor={hexToRgba(colors.white, 0.5)}
        />
      </Animated.View>
    </View>
  );
}
