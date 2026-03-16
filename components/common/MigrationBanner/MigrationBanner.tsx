import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './MigrationBannerStyles';

/**
 * Migration banner component to inform users about the app replacement
 */
export default function MigrationBanner() {
  return (
    <View style={styles.banner}>
      <FontAwesomeIcon style={styles.icon} icon={faInfoCircle} size={16} />
      <Text style={styles.text}>
        Denne appen vil bli erstattet før sommeren 2026. Se Om-siden for mer informasjon.
      </Text>
    </View>
  );
}

