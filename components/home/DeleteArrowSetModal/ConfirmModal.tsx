import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/common';
import { useTranslation } from '@/contexts';
import { styles } from './ConfirmModalStyles';

interface ConfirmModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /**
   * Render as a plain overlay inside an already-open modal instead of a
   * second native RN Modal. Stacking native modals on iOS is unreliable:
   * the second modal may not present, and dismissing both in the same frame
   * can leave the root view untouchable.
   */
  embedded?: boolean;
}

export default function ConfirmModal({
  visible,
  onCancel,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  embedded = false,
}: ConfirmModalProps) {
  const { t } = useTranslation();

  if (!visible) return null;

  const content = (
    <Pressable style={styles.overlay} onPress={onCancel}>
      <Pressable style={styles.box} onPress={(e) => e.stopPropagation()}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        <Text style={styles.text}>{message}</Text>
        <View style={styles.actions}>
          <Button label={cancelLabel ?? t['common.cancel']} type="outline" onPress={onCancel} />
          <Button variant="warning" label={confirmLabel ?? t['common.delete']} onPress={onConfirm} />
        </View>
      </Pressable>
    </Pressable>
  );

  if (embedded) {
    return <View style={StyleSheet.absoluteFill}>{content}</View>;
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      {content}
    </Modal>
  );
}
