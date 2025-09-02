import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 16,
  },
  bowContainer: {
    marginBottom: 24,
  },
  arrowContainer: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 8,
  },
  bowGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  arrowGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'flex-start',
  },
});
