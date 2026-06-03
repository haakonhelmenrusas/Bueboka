import { useCallback, useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { Button, Input, ModalHeader, ModalWrapper } from '@/components/common';
import { Arrows, Bow } from '@/types';
import { arrowsRepository, bowRepository } from '@/services/repositories';
import { useTranslation } from '@/contexts';
import * as Sentry from '@sentry/react-native';
import { styles } from './EquipmentModalStyles';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function EquipmentModal({ visible, onClose }: Props) {
  const { t } = useTranslation();
  const [bow, setBow] = useState<Bow | null>(null);
  const [arrows, setArrows] = useState<Arrows | null>(null);
  const [eyeToNock, setEyeToNock] = useState('');
  const [eyeToSight, setEyeToSight] = useState('');
  const [aimMeasure, setAimMeasure] = useState('');
  const [arrowWeight, setArrowWeight] = useState('');
  const [status, setStatus] = useState<'idle' | 'pending'>('idle');

  const loadEquipment = useCallback(async () => {
    try {
      const [bows, arrowSets] = await Promise.all([bowRepository.getAll(), arrowsRepository.getAll()]);
      const favBow = (Array.isArray(bows) ? bows : []).find((b) => b.isFavorite) ?? bows[0] ?? null;
      const favArrows = (Array.isArray(arrowSets) ? arrowSets : []).find((a) => a.isFavorite) ?? arrowSets[0] ?? null;
      setBow(favBow);
      setArrows(favArrows);
      setEyeToNock(favBow?.eyeToNock?.toString() ?? '');
      setEyeToSight(favBow?.eyeToSight?.toString() ?? '');
      setAimMeasure(favBow?.aimMeasure?.toString() ?? '');
      setArrowWeight(favArrows?.weight?.toString() ?? '');
    } catch (err) {
      Sentry.captureException(err);
    }
  }, []);

  useEffect(() => {
    if (visible) loadEquipment();
  }, [visible, loadEquipment]);

  function handleNumberInput(value: string, setter: (v: string) => void) {
    const cleaned = value.replace(',', '.').replace(/[^0-9.]/g, '');
    setter(cleaned);
  }

  async function handleSave() {
    try {
      setStatus('pending');
      Keyboard.dismiss();
      const updates: Promise<any>[] = [];

      if (bow) {
        updates.push(
          bowRepository.update(bow.id, {
            name: bow.name,
            type: bow.type,
            eyeToNock: eyeToNock ? parseFloat(eyeToNock) : null,
            aimMeasure: aimMeasure ? parseFloat(aimMeasure) : null,
            eyeToSight: eyeToSight ? parseFloat(eyeToSight) : null,
            limbs: bow.limbs ?? undefined,
            riser: bow.riser ?? undefined,
            handOrientation: bow.handOrientation,
            drawWeight: bow.drawWeight ?? undefined,
            bowLength: bow.bowLength ?? undefined,
            notes: bow.notes ?? undefined,
            isFavorite: bow.isFavorite,
          }),
        );
      }

      if (arrows) {
        updates.push(
          arrowsRepository.update(arrows.id, {
            name: arrows.name,
            material: arrows.material,
            weight: arrowWeight ? parseFloat(arrowWeight) : null,
            arrowsCount: arrows.arrowsCount ?? undefined,
            diameter: arrows.diameter ?? undefined,
            length: arrows.length ?? undefined,
            spine: arrows.spine ?? undefined,
            pointType: arrows.pointType ?? undefined,
            pointWeight: arrows.pointWeight ?? undefined,
            vanes: arrows.vanes ?? undefined,
            nock: arrows.nock ?? undefined,
            notes: arrows.notes ?? undefined,
            isFavorite: arrows.isFavorite,
          }),
        );
      }

      await Promise.all(updates);
      onClose();
    } catch (err) {
      Sentry.captureException(err);
    } finally {
      setStatus('idle');
    }
  }

  return (
    <ModalWrapper visible={visible} onClose={onClose}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : undefined}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.modal} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} bounces={false}>
          <ModalHeader onPress={onClose} title={t['sightMarks.equipmentTitle']} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{bow?.name ?? t['sightMarks.unknownBow']}</Text>
            <View style={styles.row}>
              <Input
                containerStyle={{ flex: 1 }}
                label={t['bowForm.eyeToNock']}
                keyboardType="numeric"
                value={eyeToNock}
                onChangeText={(v) => handleNumberInput(v, setEyeToNock)}
              />
              <Input
                containerStyle={{ flex: 1 }}
                label={t['bowForm.eyeToSight']}
                keyboardType="numeric"
                value={eyeToSight}
                onChangeText={(v) => handleNumberInput(v, setEyeToSight)}
              />
            </View>
            <Input
              label={t['sightMarks.equipmentAimMeasure']}
              keyboardType="numeric"
              value={aimMeasure}
              onChangeText={(v) => handleNumberInput(v, setAimMeasure)}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{arrows?.name ?? t['sightMarks.equipmentArrows']}</Text>
            <Input
              label={t['sightMarks.equipmentArrowWeight']}
              keyboardType="numeric"
              value={arrowWeight}
              helpText={t['arrowForm.weightHelpText']}
              onChangeText={(v) => handleNumberInput(v, setArrowWeight)}
            />
          </View>

          <View style={styles.buttons}>
            <Button loading={status === 'pending'} buttonStyle={{ flex: 1 }} label={t['form.save']} onPress={handleSave} />
            <Button type="outline" buttonStyle={{ flex: 1 }} label={t['common.cancel']} onPress={onClose} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ModalWrapper>
  );
}
