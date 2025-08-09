import React from 'react';
import { Text, View, TextStyle, ViewStyle } from 'react-native';
import { styles } from './DataValueStyles';

type Primitive = string | number | null | undefined;

interface Props {
  value: Primitive;
  suffix?: string;
  capitalize?: boolean;
  textStyle?: TextStyle;
  pillStyle?: ViewStyle;
  pillTextStyle?: TextStyle;
}

const isEmpty = (v: Primitive) =>
  v === null || v === undefined || (typeof v === 'string' && v.trim() === '') || (typeof v === 'number' && Number.isNaN(v));

const capFirst = (s: string) => (s.length ? s[0].toUpperCase() + s.slice(1) : s);

export default function DataValue({ value, suffix = '', capitalize = false, textStyle, pillStyle, pillTextStyle }: Props) {
  if (isEmpty(value)) {
    return (
      <View style={[styles.pill, pillStyle]}>
        <Text style={[styles.pillText, pillTextStyle]}>Ingen data</Text>
      </View>
    );
  }

  let display: string;
  if (typeof value === 'number') {
    display = `${value}${suffix}`;
  } else {
    const str = String(value);
    display = `${capitalize ? capFirst(str) : str}${suffix}`;
  }

  return <Text style={textStyle}>{display}</Text>;
}
