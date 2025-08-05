// components/common/ModalWrapper.tsx
import React from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';

interface ModalWrapperProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function ModalWrapper({ visible, onClose, children }: ModalWrapperProps) {
  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>{children}</Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
