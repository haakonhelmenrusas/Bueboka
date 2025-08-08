import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Button } from '@/components/common';
import { styles } from './DeleteArrowSetModalStyles';

interface DeleteArrowSetModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteArrowSetModal({ visible, onCancel, onConfirm }: DeleteArrowSetModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.box} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.text}>Vil du slette dette pilsettet?</Text>
          <View style={styles.actions}>
            <Button label="Avbryt" type="outline" onPress={onCancel} />
            <Button label="Slett" onPress={onConfirm} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
