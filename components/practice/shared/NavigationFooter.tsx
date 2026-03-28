import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
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
  onCancel: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSave: () => void;
  onDelete: () => void;
  showSaveOnAllSteps?: boolean;
}

export function NavigationFooter({
  currentStep,
  totalSteps,
  stepLabels,
  isEditing,
  submitting,
  saveLabel,
  onCancel,
  onPrev,
  onNext,
  onSave,
  onDelete,
  showSaveOnAllSteps = false,
}: NavigationFooterProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <View style={styles.navFooter}>
      <View style={styles.navRow}>
        {/* Left: cancel — always visible */}
        <TouchableOpacity style={styles.navCancelBtn} onPress={onCancel} accessibilityLabel="Avbryt">
          <FontAwesomeIcon icon={faXmark} size={14} color={colors.textSecondary} />
          <Text style={styles.navCancelText}>Avbryt</Text>
        </TouchableOpacity>

        {/* Center: prev / step name / next */}
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

        {/* Right: delete when editing, spacer otherwise */}
        {isEditing ? (
          <TouchableOpacity style={styles.navDeleteBtn} onPress={onDelete} accessibilityLabel="Slett">
            <FontAwesomeIcon icon={faTrashCan} size={16} color={colors.error} />
          </TouchableOpacity>
        ) : (
          <View style={styles.navDeleteBtn} />
        )}
      </View>

      {(showSaveOnAllSteps || isLastStep) && (
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
  },
  navCancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 4,
    minWidth: 70,
  },
  navCancelText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  navCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    justifyContent: 'center',
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
  },
  navActions: {
    padding: 16,
    gap: 12,
  },
  saveButton: {
    width: '100%',
  },
});
