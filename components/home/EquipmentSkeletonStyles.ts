import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 12,
    width: '31%',
    aspectRatio: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  textWrap: {
    alignItems: 'center',
    gap: 6,
    width: '100%',
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
