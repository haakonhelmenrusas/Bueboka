import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../Button';

interface MessageProps {
  title: string;
  description: string;
  onPress?: () => void;
  buttonLabel?: string;
}

const Message: React.FC<MessageProps> = ({ title, description, onPress, buttonLabel }) => {
  return (
    <View style={styles.messageContainer}>
      <Text style={styles.messageTitle}>
        <FontAwesomeIcon style={styles.icon} icon={faInfoCircle} /> {title}
      </Text>
      <Text style={styles.messageText}>{description}</Text>
      {onPress && buttonLabel && <Button onPress={onPress} label={buttonLabel} />}
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    height: '70%',
  },
  messageTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 16,
  },
  icon: {
    color: '#f0ad4e',
  },
  messageText: {
    fontSize: 16,
    marginBottom: 16,
  },
});

export default Message;
