import React, { FC, useEffect, useRef, useState } from 'react';
import { Keyboard, Platform, TextInput, View } from 'react-native';
import { Button, Input, Notch } from '@/components/common';
import { MarkValue } from '@/types';
import { faRulerHorizontal } from '@fortawesome/free-solid-svg-icons/faRulerHorizontal';
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons/faCrosshairs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { styles } from './MarksFormStyles';
import Animated, { runOnJS, SharedValue, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { colors } from '@/styles/colors';
import { checkDecimalCount } from '@/utils';

interface MarksFormProps {
  status: string;
  sendMarks: (newMark: MarkValue) => Promise<void>;
  setIsFormVisible: (visible: boolean) => void;
  translateY: SharedValue<number>;
  /** When true, shows a name input for the new sight mark set. */
  isNewSet?: boolean;
}

const MarksForm: FC<MarksFormProps> = ({ sendMarks, status, setIsFormVisible, translateY, isNewSet = false }) => {
  const [aimValue, setAimValue] = useState('');
  const [distanceValue, setDistance] = useState('');
  const [nameValue, setNameValue] = useState('');
  const distanceInputRef = useRef<TextInput>(null);
  const keyboardHeight = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value - keyboardHeight.value }],
  }));

  const closeForm = () => {
    Keyboard.dismiss();
    translateY.value = withTiming(300, { duration: 200 }, () => {
      runOnJS(setIsFormVisible)(false);
    });
  };

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      if (e.translationY > 100) {
        runOnJS(closeForm)();
      } else {
        translateY.value = withSpring(0);
      }
    });

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      keyboardHeight.value = withTiming(e.endCoordinates.height, {
        duration: Platform.OS === 'ios' ? (e.duration ?? 250) : 200,
      });
    });

    const hideSub = Keyboard.addListener(hideEvent, (e) => {
      keyboardHeight.value = withTiming(0, {
        duration: Platform.OS === 'ios' ? (e.duration ?? 250) : 200,
      });
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [keyboardHeight]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      distanceInputRef.current?.focus();
    }, 280);
    return () => clearTimeout(timeout);
  }, []);

  async function handleAddMark() {
    if (aimValue && distanceValue) {
      const newEntry: MarkValue = { aim: parseFloat(aimValue), distance: parseFloat(distanceValue), name: nameValue || undefined };
      await sendMarks(newEntry);
      setAimValue('');
      setDistance('');
      setNameValue('');
      Keyboard.dismiss();
      setIsFormVisible(false);
    }
  }

  function handleDistanceChange(value: string) {
    const cleanValue = value.replace(/[^0-9.]/g, '');
    const parsedValue = parseFloat(cleanValue);
    if (!checkDecimalCount(cleanValue, 3)) return;
    if (!isNaN(parsedValue)) {
      setDistance(value.replace(',', '.'));
    } else {
      setDistance('');
    }
  }

  function handleAimChange(value: string) {
    const cleanValue = value.replace(/[^0-9.]/g, '');
    const parsedValue = parseFloat(cleanValue);
    if (!checkDecimalCount(cleanValue, 3)) return;
    if (!isNaN(parsedValue)) {
      setAimValue(value.replace(',', '.'));
    } else {
      setAimValue('');
    }
  }

  return (
    <View>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.form, animatedStyle]}>
          <Notch />
          {isNewSet && (
            <Input
              label="Navn på innskyting (valgfritt)"
              value={nameValue}
              onChangeText={setNameValue}
              containerStyle={{ marginBottom: 8 }}
              placeholder="F.eks. Utendørs 2025"
            />
          )}
          <View style={styles.inputs}>
            <Input
              textAlign="center"
              labelStyle={{ justifyContent: 'center' }}
              label="Avstand"
              keyboardType="numeric"
              value={distanceValue}
              onChangeText={(value) => handleDistanceChange(value)}
              icon={<FontAwesomeIcon icon={faRulerHorizontal} color={colors.secondary} />}
              containerStyle={{ flex: 1 }}
              ref={distanceInputRef}
            />
            <Input
              textAlign="center"
              labelStyle={{ justifyContent: 'center' }}
              label="Merke"
              keyboardType="numeric"
              value={aimValue}
              onChangeText={(value) => handleAimChange(value)}
              icon={<FontAwesomeIcon icon={faCrosshairs} color={colors.secondary} />}
              containerStyle={{ flex: 1 }}
            />
          </View>
          <Button
            disabled={aimValue === '' || distanceValue === ''}
            loading={status === 'pending'}
            buttonStyle={styles.button}
            onPress={handleAddMark}
            label="Beregn"
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default MarksForm;
