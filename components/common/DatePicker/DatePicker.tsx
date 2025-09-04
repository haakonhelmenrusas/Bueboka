import React, { useState } from 'react';
import { Modal, Platform, StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons/faCalendar';
import { defaultStyles } from './DatePickerStyles';
import { colors } from '@/styles/colors';

interface DatePickerProps {
  label: string;
  value: Date;
  onDateChange: (date: Date) => void;
  error?: boolean;
  errorMessage?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  testID?: string;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

/**
 * Native DatePicker component using @react-native-community/datetimepicker
 * Works on iOS and Android with platform-specific native pickers
 */
export default function DatePicker({
  label,
  value,
  onDateChange,
  error = false,
  errorMessage,
  containerStyle,
  labelStyle,
  testID,
  placeholder = 'Velg dato',
  minimumDate,
  maximumDate,
}: DatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(value);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('nb-NO', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateShort = (date: Date): string => {
    return date.toLocaleDateString('nb-NO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const handleDatePress = () => {
    setTempDate(value);
    setShowPicker(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (event.type === 'set' && selectedDate) {
      setTempDate(selectedDate);
      if (Platform.OS === 'android') {
        // On Android, immediately apply the date when user confirms
        onDateChange(selectedDate);
      }
    } else if (event.type === 'dismissed') {
      // User cancelled, close picker without changing date
      setShowPicker(false);
    }
  };

  const handleIOSConfirm = () => {
    // On iOS, apply the temporary date when modal is closed
    onDateChange(tempDate);
    setShowPicker(false);
  };

  const handleIOSCancel = () => {
    // On iOS, revert to original date
    setTempDate(value);
    setShowPicker(false);
  };

  return (
    <View style={[defaultStyles.container, containerStyle]} testID={testID}>
      <View style={[defaultStyles.labelContainer, labelStyle]}>
        <FontAwesomeIcon icon={faCalendar} size={16} color={colors.primary} style={defaultStyles.icon} />
        <Text style={defaultStyles.label}>{label}</Text>
      </View>

      <TouchableOpacity
        style={[defaultStyles.dateButton, error && defaultStyles.dateButtonError]}
        onPress={handleDatePress}
        testID={`${testID}-trigger`}
        accessibilityLabel={`${label}. Valgt dato: ${formatDate(value)}`}
        accessibilityRole="button"
        activeOpacity={0.7}>
        <Text style={defaultStyles.dateText}>{formatDateShort(value)}</Text>
        <FontAwesomeIcon icon={faCalendar} size={14} color={colors.secondary} />
      </TouchableOpacity>

      {error && errorMessage && <Text style={defaultStyles.errorText}>{errorMessage}</Text>}

      {/* iOS Modal */}
      {Platform.OS === 'ios' && (
        <Modal visible={showPicker} transparent={true} animationType="slide" onRequestClose={handleIOSCancel}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'flex-end',
            }}
            activeOpacity={1}
            onPress={handleIOSCancel}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {}} // Prevent modal from closing when tapping inside
            >
              <View style={defaultStyles.iosModalContainer}>
                <View style={defaultStyles.iosModalHeader}>
                  <TouchableOpacity
                    style={defaultStyles.iosModalButton}
                    onPress={handleIOSCancel}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Text style={defaultStyles.iosModalButtonText}>Avbryt</Text>
                  </TouchableOpacity>
                  <Text style={defaultStyles.iosModalTitle}>Velg dato</Text>
                  <TouchableOpacity
                    style={defaultStyles.iosModalButton}
                    onPress={handleIOSConfirm}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Text style={[defaultStyles.iosModalButtonText, defaultStyles.iosModalConfirmText]}>Ferdig</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  minimumDate={minimumDate}
                  maximumDate={maximumDate}
                  locale="nb-NO"
                  style={defaultStyles.iosDatePicker}
                />
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Android native picker */}
      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          locale="nb-NO"
        />
      )}
    </View>
  );
}
