import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export const styles = StyleSheet.create({
    container: {
        alignContent: 'center',
        width: '100%',
        marginHorizontal: 'auto',
        marginBottom: 8,
        backgroundColor: colors.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.secondary,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
        borderTopEndRadius: 8,
        borderTopStartRadius: 8,
        backgroundColor: colors.secondary,
    },
    image: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginRight: 16,
    },
    title: {
        fontSize: 20,
        color: colors.tertiary,
        fontWeight: 'medium',
    },
    cogIcon: {
        marginLeft: 'auto',
        padding: 4,
    },
    body: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
    },
    column: {

    },
    head: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    text: {
        fontSize: 14,
        marginBottom: 16,
    },
    trashIcon: {
        marginLeft: 12,
        padding: 4,
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
