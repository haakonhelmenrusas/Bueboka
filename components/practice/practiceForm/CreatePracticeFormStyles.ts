import { Platform, StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    height: '95%',
    ...Platform.select({
      android: {
        minHeight: '80%',
      },
    }),
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  scrollContainer: {
    flexGrow: 1,
    ...Platform.select({
      android: {
        minHeight: '90%',
      },
    }),
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
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.tertiary,
  },
  saveButton: {
    backgroundColor: colors.secondary,
  },
});
