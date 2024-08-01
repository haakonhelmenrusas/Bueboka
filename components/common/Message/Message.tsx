import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../Button/Button';

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
      {onPress && buttonLabel && <Button width={300} onPress={onPress} label={buttonLabel} />}
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    backgroundColor: '#D8F5FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 'auto',
  },
  messageTitle: {
    color: '#053546',
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 16,
  },
  icon: {
    color: '#053546',
  },
  messageText: {
    color: '#053546',
    fontSize: 16,
    marginBottom: 16,
  },
});

export default Message;
