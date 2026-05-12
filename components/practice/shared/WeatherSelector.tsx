import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { WeatherCondition } from '@/types';
import { colors } from '@/styles/colors';
import { useTranslation } from '@/contexts';
import { getWeatherOptions } from './formConstants';

interface WeatherSelectorProps {
  selectedWeather: WeatherCondition[];
  onToggleWeather: (condition: WeatherCondition) => void;
}

export function WeatherSelector({ selectedWeather, onToggleWeather }: WeatherSelectorProps) {
  const { t } = useTranslation();
  const options = getWeatherOptions(t);
  return (
    <View style={styles.weatherSection}>
      <Text style={styles.weatherLabel}>{`${t['form.weather']} ${t['form.optional']}`}</Text>
      <View style={styles.weatherChips}>
        {options.map((opt) => {
          const active = selectedWeather.includes(opt.value);
          return (
            <Pressable
              key={opt.value}
              style={[styles.weatherChip, active && styles.weatherChipActive]}
              onPress={() => onToggleWeather(opt.value)}>
              <Text style={[styles.weatherChipText, active && styles.weatherChipTextActive]}>{opt.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  weatherSection: {
    marginVertical: 8,
  },
  weatherLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  weatherChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  weatherChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgGray100,
  },
  weatherChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  weatherChipText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  weatherChipTextActive: {
    color: colors.white,
  },
});
