import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons/faTrashCan';
import { Button } from '@/components/common';
import { colors } from '@/styles/colors';

interface NavigationFooterProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  isEditing: boolean;
  submitting: boolean;
  saveLabel?: string;
  onPrev: () => void;
  onNext: () => void;
  onSave: () => void;
  onDelete: () => void;
}

export function NavigationFooter({
  currentStep,
  totalSteps,
  stepLabels,
  isEditing,
  submitting,
  saveLabel,
  onPrev,
  onNext,
  onSave,
  onDelete,
}: NavigationFooterProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <View style={styles.navFooter}>
      <View style={styles.navRow}>
        <View style={styles.navCenter}>
          <TouchableOpacity
            style={[styles.navArrow, isFirstStep && styles.navArrowDisabled]}
            onPress={onPrev}
            disabled={isFirstStep}
            accessibilityLabel="Forrige steg">
            <FontAwesomeIcon icon={faChevronLeft} size={18} color={isFirstStep ? colors.dimmed : colors.primary} />
          </TouchableOpacity>

          <Text style={styles.navStepName}>{stepLabels[currentStep]}</Text>

          {isLastStep ? (
            <View style={styles.navArrow} />
          ) : (
            <TouchableOpacity style={styles.navArrow} onPress={onNext} accessibilityLabel="Neste steg">
              <FontAwesomeIcon icon={faChevronRight} size={18} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Right: delete when editing on last step, spacer otherwise */}
        {isEditing && isLastStep ? (
          <TouchableOpacity style={styles.navDeleteBtn} onPress={onDelete} accessibilityLabel="Slett">
            <FontAwesomeIcon icon={faTrashCan} size={16} color={colors.error} />
          </TouchableOpacity>
        ) : (
          <View style={styles.navDeleteBtn} />
        )}
      </View>

      {/* Save button only on last step */}
      {isLastStep && (
        <View style={styles.navActions}>
          <Button
            label={submitting ? 'Lagrer...' : saveLabel || 'Lagre'}
            onPress={onSave}
            disabled={submitting}
            loading={submitting}
            buttonStyle={styles.saveButton}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  navFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'relative',
  },
  navCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    zIndex: 0,
  },
  navArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgGray50,
  },
  navArrowDisabled: {
    opacity: 0.3,
  },
  navStepName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    minWidth: 80,
    textAlign: 'center',
  },
  navDeleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  navActions: {
    padding: 16,
    gap: 12,
  },
  saveButton: {
    width: '100%',
  },
});
