import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFC107',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    color: '#856404',
    flexShrink: 0,
    marginRight: 8,
  },
  text: {
    color: '#856404',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    lineHeight: 18,
  },
});
