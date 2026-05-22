import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, useWindowDimensions } from 'react-native';
import ViewShot, { type ViewShotRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { ModalWrapper, ModalHeader, Button } from '@/components/common';
import { SessionShareCard } from './SessionShareCard';
import type { SessionShareData } from './SessionShareCard';
import { colors } from '@/styles/colors';
import { useTranslation } from '@/contexts';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons/faShare';

interface ShareSessionModalProps {
  visible: boolean;
  onClose: () => void;
  data: SessionShareData;
}

export function ShareSessionModal({ visible, onClose, data }: ShareSessionModalProps) {
  const { t } = useTranslation();
  const { height } = useWindowDimensions();
  const viewShotRef = useRef<ViewShotRef>(null);
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    setSharing(true);
    try {
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) return;
      await Sharing.shareAsync(uri, { mimeType: 'image/png' });
    } catch (err: unknown) {
      if (err instanceof Error && err.message !== 'User did not share') {
        Alert.alert(t['common.error'], t['shareModal.shareError']);
      }
    } finally {
      setSharing(false);
    }
  };

  return (
    <ModalWrapper visible={visible} onClose={onClose}>
      <View style={[s.modal, { height: height * 0.88 }]}>
        <ModalHeader title={t['shareModal.title']} onPress={onClose} />
        <Text style={s.hint}>{t['shareModal.hint']}</Text>
        <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={s.cardWrapper}>
            <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1, result: 'tmpfile' }}>
              <SessionShareCard data={data} />
            </ViewShot>
          </View>
        </ScrollView>
        <View style={s.actions}>
          <Button
            label={sharing ? t['shareModal.sharing'] : t['shareModal.share']}
            onPress={handleShare}
            disabled={sharing}
            loading={sharing}
            icon={<FontAwesomeIcon icon={faShare} size={16} color={colors.white} />}
          />
        </View>
      </View>
    </ModalWrapper>
  );
}

const s = StyleSheet.create({
  modal: {
    backgroundColor: colors.modalBg,
    borderRadius: 20,
    overflow: 'hidden',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  hint: {
    color: colors.textSecondary,
    fontSize: 13,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  cardWrapper: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  actions: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
