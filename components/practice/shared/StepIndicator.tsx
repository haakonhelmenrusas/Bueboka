import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepPress: (step: number) => void;
}

export function StepIndicator({ steps, currentStep, onStepPress }: StepIndicatorProps) {
  const totalSteps = steps.length;

  return (
    <View style={styles.stepIndicator}>
      {steps.map((label, i) => {
        const isActive = i === currentStep;
        const isCompleted = i < currentStep;
        return (
          <React.Fragment key={i}>
            <TouchableOpacity style={styles.stepItem} onPress={() => onStepPress(i)} accessibilityLabel={`Gå til ${label}`}>
              <View style={[styles.stepDot, isActive && styles.stepDotActive, isCompleted && styles.stepDotCompleted]}>
                <Text style={[styles.stepDotText, (isActive || isCompleted) && styles.stepDotTextActive]}>{i + 1}</Text>
              </View>
              <Text style={[styles.stepLabel, isActive && styles.stepLabelActive, isCompleted && styles.stepLabelCompleted]}>{label}</Text>
            </TouchableOpacity>
            {i < totalSteps - 1 && <View style={[styles.stepConnector, isCompleted && styles.stepConnectorCompleted]} />}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bgGray50,
  },
  stepItem: {
    alignItems: 'center',
    gap: 4,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  stepDotCompleted: {
    borderColor: colors.secondary,
    backgroundColor: colors.secondary,
  },
  stepDotText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  stepDotTextActive: {
    color: colors.white,
  },
  stepLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  stepLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  stepLabelCompleted: {
    color: colors.secondary,
  },
  stepConnector: {
    flex: 1,
    height: 1.5,
    backgroundColor: colors.border,
    marginBottom: 16,
    marginHorizontal: 4,
  },
  stepConnectorCompleted: {
    backgroundColor: colors.secondary,
  },
});
