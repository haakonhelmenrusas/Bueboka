import React from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';

interface ModalWrapperProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  fullScreen?: boolean;
}

export default function ModalWrapper({ visible, onClose, children, fullScreen = false }: ModalWrapperProps) {
  return (
    <Modal presentationStyle="overFullScreen" animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={fullScreen ? styles.contentFullScreen : styles.content} onPress={() => {}}>
          {children}
        </Pressable>
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
  content: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '90%',
    alignSelf: 'center',
  },
  contentFullScreen: {
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
  },
});
