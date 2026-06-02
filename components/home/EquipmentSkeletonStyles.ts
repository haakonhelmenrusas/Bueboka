import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  textWrap: {
    flex: 1,
    gap: 6,
  },
  namePlaceholder: {
    width: '60%',
    height: 14,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  metaPlaceholder: {
    width: '40%',
    height: 12,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
