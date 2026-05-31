import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { styles } from './ModalWrapperStyles';

interface ModalWrapperProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  fullScreen?: boolean;
}

export default function ModalWrapper({ visible, onClose, children, fullScreen = false }: ModalWrapperProps) {
  return (
    <Modal presentationStyle="overFullScreen" animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={fullScreen ? styles.contentFullScreen : styles.content}>{children}</View>
      </View>
    </Modal>
  );
}
