import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { ModalWrapper, ModalHeader, Button, Input } from '@/components/common';
import { colors } from '@/styles/colors';
import { useTranslation } from '@/contexts';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons/faStar';
import { authFetchClient } from '@/services/api/authFetch';

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export function FeedbackModal({ visible, onClose, onSubmitted }: FeedbackModalProps) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    if (loading) return;
    setRating(0);
    setFeedback('');
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setError(t['feedback.errorNoRating']);
      return;
    }
    if (!feedback.trim()) {
      setError(t['feedback.errorNoText']);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authFetchClient.post('/feedback', { rating, feedback });
      setRating(0);
      setFeedback('');
      onClose();
      onSubmitted?.();
    } catch {
      Alert.alert(t['common.error'], t['feedback.errorSend']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper visible={visible} onClose={handleClose}>
      <View style={s.modal}>
        <ModalHeader title={t['feedback.title']} onPress={handleClose} />
        <View style={s.content}>
          {error && (
            <View style={s.errorBanner}>
              <Text style={s.errorText}>{error}</Text>
            </View>
          )}

          <Text style={s.label}>{t['feedback.ratingLabel']}</Text>
          <View style={s.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable
                key={star}
                onPress={() => setRating(star)}
                hitSlop={4}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel={`${star}`}>
                <FontAwesomeIcon
                  icon={star <= rating ? faStar : faStarOutline}
                  size={36}
                  color={star <= rating ? colors.accentYellow : colors.inactive}
                />
              </Pressable>
            ))}
          </View>

          <Input
            label={t['feedback.textLabel']}
            value={feedback}
            onChangeText={setFeedback}
            placeholder={t['feedback.placeholder']}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            editable={!loading}
            inputStyle={s.textarea}
          />

          <View style={s.actions}>
            <Button label={t['feedback.cancel']} onPress={handleClose} type="outline" disabled={loading} buttonStyle={s.actionButton} />
            <Button
              label={loading ? t['feedback.submitting'] : t['feedback.submit']}
              onPress={handleSubmit}
              disabled={loading || rating === 0 || !feedback.trim()}
              loading={loading}
              buttonStyle={s.actionButton}
            />
          </View>
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
  content: {
    padding: 20,
    gap: 16,
  },
  errorBanner: {
    backgroundColor: colors.errorBg,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    borderRadius: 8,
    padding: 10,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '600',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  textarea: {
    minHeight: 120,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  actionButton: {
    flex: 1,
  },
});
