import React, { FC, useRef, useState } from 'react';
import { Animated, Keyboard, PanResponder, View } from 'react-native';
import { Button, Input, Notch } from '@/components/common';
import { MarkValue } from '@/types';
import { formatNumber } from '@/utils';
import { useCalcForm } from '../../hooks/useCalcForm';
import { faRulerHorizontal } from '@fortawesome/free-solid-svg-icons/faRulerHorizontal';
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons/faCrosshairs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { checkDecimalCount } from '@/utils/helpers/checkDecimalCount';
import { styles } from './MarksFormStyles';

interface MarksFormProps {
  status: string;
  sendMarks: (newMark: MarkValue) => Promise<void>;
  onInputFocusChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const MarksForm: FC<MarksFormProps> = ({ sendMarks, status, onInputFocusChange }) => {
  const [{ aimError, aimValue, distanceError, distanceValue }, dispatch] = useCalcForm();
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 300 })).current;
  const [isFormVisible, setIsFormVisible] = useState(false);
  console.log(distanceValue, aimValue);
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => {
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dy > 0) {
          Animated.event([null, { dy: pan.y }], { useNativeDriver: false })(e, gestureState);
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > 100) {
          closeForm();
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        }
      },
    }),
  ).current;

  const closeForm = () => {
    Animated.timing(pan, { toValue: { x: 0, y: 300 }, duration: 300, useNativeDriver: false }).start(() => {
      setIsFormVisible(false);
    });
  };

  const openForm = () => {
    setIsFormVisible(true);
    Animated.timing(pan, { toValue: { x: 0, y: 0 }, duration: 1000, useNativeDriver: false }).start();
  };

  function handleNumberChange(value: string, key: any) {
    const cleanValue = value.replace(/[^0-9.]/g, '');
    const parsedValue = parseFloat(cleanValue);

    if (checkDecimalCount(cleanValue, 3)) {
      return;
    }
    if (!isNaN(parsedValue)) {
      console.log('parsedValue', parsedValue);
      dispatch({ type: key, payload: formatNumber(value) });
    } else {
      dispatch({ type: key, payload: '' });
    }
  }

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
        <Animated.View style={[styles.form, { transform: [{ translateY: pan.y }] }]} {...panResponder.panHandlers}>
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
              onChangeText={(value) => handleNumberChange(value, 'SET_DISTANCE_VALUE')}
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
              onChangeText={(value) => handleNumberChange(value, 'SET_AIM_VALUE')}
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
      )}
    </View>
  );
};

export default MarksForm;
