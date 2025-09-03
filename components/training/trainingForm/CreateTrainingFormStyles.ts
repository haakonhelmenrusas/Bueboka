import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  inputContainer: {
    marginVertical: 16,
  },
  startButton: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    height: 48,
    marginTop: 24,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.tertiary,
  },
  saveButton: {
    backgroundColor: colors.secondary,
  },
});
