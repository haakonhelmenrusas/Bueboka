import React, { FC, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { Button, Input, Notch } from '@/components/common';
import { MarkValue } from '@/types';
import { faRulerHorizontal } from '@fortawesome/free-solid-svg-icons/faRulerHorizontal';
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons/faCrosshairs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { styles } from './MarksFormStyles';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { colors } from '@/styles/colors';
import { checkDecimalCount } from '@/utils';

interface MarksFormProps {
  status: string;
  sendMarks: (newMark: MarkValue) => Promise<void>;
}

const MarksForm: FC<MarksFormProps> = ({ sendMarks, status }) => {
  const [aimValue, setAimValue] = useState('');
  const [distanceValue, setDistance] = useState('');
  const translateY = useSharedValue(300);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const closeForm = () => {
    translateY.value = withTiming(300, { duration: 300 }, () => {
      runOnJS(setIsFormVisible)(false);
    });
  };

  const openForm = () => {
    setIsFormVisible(true);
    translateY.value = withTiming(0, { duration: 300 });
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

  async function handleAddMark() {
    if (aimValue && distanceValue) {
      const newEntry: MarkValue = { aim: parseFloat(aimValue), distance: parseFloat(distanceValue) };
      await sendMarks(newEntry);
      setAimValue('');
      setDistance('');
      Keyboard.dismiss();
      setIsFormVisible(false);
    }
  }

  function handleDistanceChange(value: string) {
    const cleanValue = value.replace(/[^0-9.]/g, '');
    const parsedValue = parseFloat(cleanValue);

    if (!checkDecimalCount(cleanValue, 3)) {
      return;
    }
    if (!isNaN(parsedValue)) {
      setDistance(value.replace(',', '.'));
    } else {
      setDistance('');
    }
  }

  function handleAimChange(value: string) {
    const cleanValue = value.replace(/[^0-9.]/g, '');
    const parsedValue = parseFloat(cleanValue);

    if (!checkDecimalCount(cleanValue, 3)) {
      return;
    }
    if (!isNaN(parsedValue)) {
      setAimValue(value.replace(',', '.'));
    } else {
      setAimValue('');
    }
  }

  return (
    <View style={styles.container}>
      {!isFormVisible && <Button label="Åpne skjema" onPress={openForm} buttonStyle={styles.formButton} />}
      {isFormVisible && (
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.form, animatedStyle]}>
            <Notch />
            <View style={styles.inputs}>
              <Input
                textAlign="center"
                labelStyle={{ justifyContent: 'center' }}
                label="Avstand"
                placeholderText="F.eks. 20"
                keyboardType="numeric"
                value={distanceValue}
                onChangeText={(value) => handleDistanceChange(value)}
                icon={<FontAwesomeIcon icon={faRulerHorizontal} color={colors.secondary} />}
                inputStyle={{ width: 160 }}
              />
              <Input
                textAlign="center"
                labelStyle={{ justifyContent: 'center' }}
                label="Merke"
                placeholderText="F.eks. 2.3"
                keyboardType="numeric"
                value={aimValue}
                onChangeText={(value) => handleAimChange(value)}
                icon={<FontAwesomeIcon icon={faCrosshairs} color={colors.secondary} />}
                inputStyle={{ width: 160 }}
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
      )}
    </View>
  );
};

export default MarksForm;
