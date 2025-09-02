import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.tertiary,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 24,
    marginVertical: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarInitial: {
    fontSize: 32,
    color: colors.white,
    fontWeight: '600',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.primary,
  },
  club: {
    fontSize: 16,
    color: colors.primary,
  },
});
