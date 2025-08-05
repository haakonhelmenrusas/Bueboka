import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modal: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  favorite: {
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 'auto',
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  confirmText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
