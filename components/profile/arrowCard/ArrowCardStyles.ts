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
        fontSize: 16,
        marginBottom: 16,
    },
});
