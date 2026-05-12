import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

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
        {/* Backdrop tap-to-close sits behind the content as a sibling, not a parent.
            Wrapping content in a Pressable intercepts scroll gestures on Android. */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={fullScreen ? styles.contentFullScreen : styles.content}>{children}</View>
      </View>
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
