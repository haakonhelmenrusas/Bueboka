import React from 'react';
import { View } from 'react-native';
import { styles } from './NotchStyles';

/**
 * Notch component, used to display a notch in the form of a thick line,
 * that the user can interact with.
 */
const Notch = () => {
  return (
    <View style={styles.notchContainer}>
      <View style={styles.notch} />
    </View>
  );
};

export default Notch;
