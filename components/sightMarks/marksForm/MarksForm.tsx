import React, { FC, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { Button, Input, Notch } from '@/components/common';
import { MarkValue } from '@/types';
import { handleNumberChange } from '@/utils';
import { useCalcForm } from '@/components/sightMarks/hooks/useCalcForm';
import { faRulerHorizontal } from '@fortawesome/free-solid-svg-icons/faRulerHorizontal';
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons/faCrosshairs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { styles } from './MarksFormStyles';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { colors } from '@/styles/colors';

interface MarksFormProps {
  status: string;
  sendMarks: (newMark: MarkValue) => Promise<void>;
}

const MarksForm: FC<MarksFormProps> = ({ sendMarks, status }) => {
  const [{ aimValue, distanceValue }, dispatch] = useCalcForm();
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
      dispatch({ type: 'SET_AIM_VALUE', payload: '' });
      dispatch({ type: 'SET_DISTANCE_VALUE', payload: '' });
      Keyboard.dismiss();
      setIsFormVisible(false);
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
                onChangeText={(value) => handleNumberChange(value, 'SET_DISTANCE_VALUE', dispatch)}
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
                onChangeText={(value) => handleNumberChange(value, 'SET_AIM_VALUE', dispatch)}
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
