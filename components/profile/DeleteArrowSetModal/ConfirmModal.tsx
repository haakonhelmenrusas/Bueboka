import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Button } from '@/components/common';
import { styles } from './ConfirmModalStyles';

interface ConfirmModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export default function ConfirmModal({
  visible,
  onCancel,
  onConfirm,
  title,
  message,
  confirmLabel = 'Slett',
  cancelLabel = 'Avbryt',
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.box} onPress={(e) => e.stopPropagation()}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          <Text style={styles.text}>{message}</Text>
          <View style={styles.actions}>
            <Button label={cancelLabel} type="outline" onPress={onCancel} />
            <Button label={confirmLabel} onPress={onConfirm} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
