import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

const windowWidth = Dimensions.get('window').width;
const containerPadding = 16;
const gridGap = 8;
const cardWidth = (windowWidth - (containerPadding * 2) - (gridGap * 2)) / 3;

export const styles = StyleSheet.create({
    container: {
        width: cardWidth,
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        shadowColor: colors.dark_primary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        position: 'relative',
    },
    image: {
        width: '50%',
        height: 64,
        marginBottom: 12,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    type: {
        fontSize: 12,
        color: colors.secondary,
        textAlign: 'center',
    },
    starContainer: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 1,
    },
});