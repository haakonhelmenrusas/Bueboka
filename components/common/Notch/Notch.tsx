import React from 'react';
import { View } from 'react-native';
import { styles } from './NotchStyles';

const Notch = () => {
  return (
    <View style={styles.notchContainer}>
      <View style={styles.notch} />
    </View>
  );
};

export default Notch;
