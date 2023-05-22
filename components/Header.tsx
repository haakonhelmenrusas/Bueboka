import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
};

export default function Header(props: Props) {
  return (
    <View style={styles.safeArea}>
      <Text style={styles.label}>{props.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
    width: '100%',
  },
  label: {
    color: '#000',
    fontSize: 26,
    textAlign: 'center',
  },
});
