import React, { useRef, useState, useMemo } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import styles from './SelectStyles';
import { colors } from '@/styles/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';

type Option = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  options: Option[];
  selectedValue?: string;
  onValueChange: (value: any) => void;
  containerStyle?: StyleProp<ViewStyle>;
  zIndex?: number;
  searchable?: boolean;
  placeholder?: string;
};

export const Select: React.FC<Props> = ({
  label,
  options,
  selectedValue,
  onValueChange,
  containerStyle,
  zIndex = 1000,
  searchable = false,
  placeholder = 'Velg et alternativ',
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectBoxPosition, setSelectBoxPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const selectBoxRef = useRef<any>(null);
  const searchInputRef = useRef<TextInput>(null);

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery) return options;
    return options.filter((opt) => opt.label.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [options, searchable, searchQuery]);

  const toggleDropdown = () => {
    if (!open && Platform.OS === 'android') {
      // Measure the select box position for Android modal positioning
      selectBoxRef.current?.measure((x, y, width, height, pageX, pageY) => {
        setSelectBoxPosition({ x: pageX, y: pageY, width, height });
      });
    }

    const nextState = !open;
    setOpen(nextState);

    if (nextState && searchable) {
      // Reset search when opening
      setSearchQuery('');
      // Small delay to focus input after opening
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }

    Animated.timing(rotateAnim, {
      toValue: nextState ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handleSelect = (value: string) => {
    onValueChange(value);
    setOpen(false);
    setSearchQuery('');
    Animated.timing(rotateAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const selectedLabel = options.find((opt) => opt.value === selectedValue)?.label || placeholder;

  const renderOption = (item: Option, index: number) => (
    <Pressable
      key={`${item.value}-${index}`}
      style={[styles.option, item.value === selectedValue && styles.optionSelected]}
      onPress={() => handleSelect(item.value)}
      android_ripple={{ color: colors.tertiary }}>
      <Text style={styles.optionText} numberOfLines={2}>
        {item.label}
      </Text>
      {item.value === selectedValue && <FontAwesomeIcon icon={faCheck} size={16} color={colors.primary} />}
    </Pressable>
  );

  const renderDropdownContent = () => (
    <ScrollView
      style={styles.optionsList}
      contentContainerStyle={styles.optionsContainer}
      showsVerticalScrollIndicator={true}
      keyboardShouldPersistTaps="handled"
      bounces={Platform.OS === 'ios'}>
      {filteredOptions.length > 0 ? (
        filteredOptions.map(renderOption)
      ) : (
        <View style={styles.option}>
          <Text style={[styles.optionText, { color: colors.dimmed }]}>Ingen treff</Text>
        </View>
      )}
    </ScrollView>
  );

  const wrapperStyle = [styles.wrapper, containerStyle, { zIndex: open ? zIndex + 1000 : zIndex }];

  return (
    <View style={wrapperStyle}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity ref={selectBoxRef} style={styles.selectBox} onPress={toggleDropdown} activeOpacity={0.7}>
        {searchable && open ? (
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Søk..."
            placeholderTextColor={colors.dimmed}
            underlineColorAndroid="transparent"
            autoCorrect={false}
          />
        ) : (
          <Text style={styles.selectText} numberOfLines={1}>
            {selectedLabel}
          </Text>
        )}
        <Animated.View style={{ transform: [{ rotate }] }}>
          <FontAwesomeIcon icon={faChevronDown} size={16} color={colors.primary} />
        </Animated.View>
      </TouchableOpacity>
      {Platform.OS === 'android' && (
        <Modal visible={open} transparent={true} animationType="fade" onRequestClose={() => setOpen(false)}>
          <Pressable style={styles.modalBackdrop} onPress={() => setOpen(false)}>
            <View
              style={[
                styles.modalDropdown,
                {
                  top: selectBoxPosition.y + selectBoxPosition.height + 5,
                  left: selectBoxPosition.x,
                  width: selectBoxPosition.width,
                },
              ]}>
              {renderDropdownContent()}
            </View>
          </Pressable>
        </Modal>
      )}
      {Platform.OS !== 'android' && open && (
        <>
          <Pressable style={[styles.overlay, { zIndex: zIndex + 1500 }]} onPress={toggleDropdown} />
          <View style={[styles.dropdown, { zIndex: zIndex + 2000 }]}>{renderDropdownContent()}</View>
        </>
      )}
    </View>
  );
};
