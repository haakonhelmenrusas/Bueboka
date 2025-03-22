import React, { FC, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { Button, Input, Notch } from '@/components/common';
import { MarkValue } from '@/types';
import { handleNumberChange } from '@/utils';
import { useCalcForm } from '../../hooks/useCalcForm';
import { faRulerHorizontal } from '@fortawesome/free-solid-svg-icons/faRulerHorizontal';
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons/faCrosshairs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { styles } from './MarksFormStyles';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface MarksFormProps {
  status: string;
  sendMarks: (newMark: MarkValue) => Promise<void>;
  onInputFocusChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const MarksForm: FC<MarksFormProps> = ({ sendMarks, status, onInputFocusChange }) => {
  const [{ aimError, aimValue, distanceError, distanceValue }, dispatch] = useCalcForm();
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
    if (!aimValue) {
      dispatch({ type: 'SET_AIM_ERROR', payload: true });
    }
    if (!distanceValue) {
      dispatch({ type: 'SET_DISTANCE_ERROR', payload: true });
    }
    if (aimValue && distanceValue) {
      const newEntry: MarkValue = { aim: parseFloat(aimValue), distance: parseFloat(distanceValue) };

      await sendMarks(newEntry);
      dispatch({ type: 'SET_AIM_VALUE', payload: '' });
      dispatch({ type: 'SET_DISTANCE_VALUE', payload: '' });
      Keyboard.dismiss();
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
                label="Avstand"
                onBlur={() => {
                  dispatch({ type: 'SET_DISTANCE_ERROR', payload: false });
                  onInputFocusChange(false);
                }}
                onFocus={() => onInputFocusChange(true)}
                placeholderText="F.eks. 20"
                keyboardType="numeric"
                error={distanceError}
                errorMessage="Fyll inn"
                value={distanceValue}
                onChangeText={(value) => handleNumberChange(value, 'SET_DISTANCE_VALUE', dispatch)}
                icon={<FontAwesomeIcon icon={faRulerHorizontal} color="#227B9A" />}
                inputStyle={{ width: 160 }}
              />
              <Input
                textAlign="center"
                label="Merke"
                onBlur={() => {
                  dispatch({ type: 'SET_AIM_ERROR', payload: false });
                  onInputFocusChange(false);
                }}
                onFocus={() => onInputFocusChange(true)}
                placeholderText="F.eks. 2.3"
                keyboardType="numeric"
                value={aimValue}
                error={aimError}
                errorMessage="Fyll inn"
                onChangeText={(value) => handleNumberChange(value, 'SET_AIM_VALUE', dispatch)}
                icon={<FontAwesomeIcon icon={faCrosshairs} color="#227B9A" />}
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
