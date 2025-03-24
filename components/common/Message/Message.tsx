import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
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
 * Message component
 * @param title
 * @param description
 * @param onPress
 * @param buttonLabel
 *
 */
const Message: React.FC<MessageProps> = ({ title, description, onPress, buttonLabel }) => {
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

export default Message;
