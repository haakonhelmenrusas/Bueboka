import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Select } from '@/components/common';
import { colors } from '@/styles/colors';

interface EquipmentSelectorProps {
  bowOptions: { label: string; value: string }[];
  arrowSetOptions: { label: string; value: string }[];
  selectedBow: string;
  selectedArrowSet: string;
  onBowChange: (value: string) => void;
  onArrowSetChange: (value: string) => void;
  containerStyle?: any;
}

export function EquipmentSelector({
  bowOptions,
  arrowSetOptions,
  selectedBow,
  selectedArrowSet,
  onBowChange,
  onArrowSetChange,
  containerStyle,
}: EquipmentSelectorProps) {
  if (bowOptions.length === 0 && arrowSetOptions.length === 0) {
    return null;
  }

  return (
    <View style={containerStyle}>
      <Text style={styles.sectionTitle}>Utstyr</Text>
      <View style={styles.row}>
        {bowOptions.length > 0 && (
          <Select
            label="🏹 Bue"
            options={bowOptions}
            selectedValue={selectedBow}
            onValueChange={onBowChange}
            placeholder="Velg bue (valgfritt)"
            containerStyle={styles.field}
          />
        )}
        {arrowSetOptions.length > 0 && (
          <Select
            label="🎯 Piler"
            options={arrowSetOptions}
            selectedValue={selectedArrowSet}
            onValueChange={onArrowSetChange}
            placeholder="Velg piler (valgfritt)"
            containerStyle={styles.field}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  field: {
    flex: 1,
    marginVertical: 8,
  },
});
