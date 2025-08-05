import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

const windowWidth = Dimensions.get('window').width;
const cardWidth = (windowWidth - 48) / 2;

export const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.dark_primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
  },
  image: {
    width: '80%',
    height: 80,
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    color: colors.secondary,
  },
  starContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
});
