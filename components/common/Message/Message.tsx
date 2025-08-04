import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { JSX } from 'react';
import { Text, View } from 'react-native';
import Button from '../Button/Button';
import { styles } from './MessageStyles';

interface MessageProps {
  title: string;
  description: string;
  onPress?: () => void;
  buttonLabel?: string;
}

/**
 * A functional React component that renders a message display UI.
 * It includes a title, a description, and optionally a button with a handler.
 *
 * @type {React.FC<MessageProps>}
 * @param {Object} props - The props for the Message component.
 * @param {string} props.title - The title text displayed in the message.
 * @param {string} props.description - The description text providing detailed information.
 * @param {function} [props.onPress] - An optional callback function triggered when the button is pressed.
 * @param {string} [props.buttonLabel] - An optional label for the button displayed below the description.
 * @returns {JSX.Element} The rendered Message component.
 */
export default function Message({ title, description, onPress, buttonLabel }: MessageProps): JSX.Element {
  return (
    <View style={styles.messageContainer}>
      <Text style={styles.messageTitle}>
        <FontAwesomeIcon style={styles.icon} icon={faInfoCircle} /> {title}
      </Text>
      <Text style={styles.messageText}>{description}</Text>
      {onPress && buttonLabel && <Button width={300} onPress={onPress} label={buttonLabel} />}
    </View>
  );
};
