import { View, TextInput, Button, Text } from 'react-native';
import { Input } from '../../../../../components/common';
import React from 'react';

const BowForm = () => {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // handle submit
    console.log('submit');
  }

  return (
    <View>
      <form onSubmit={handleSubmit}>
        <label>
          Navn:
          <Input label="Navn" />
        </label>
        <label>
          Buetype:
          <Input label="type" />
        </label>
        <input type="submit" value="Submit" />
        <Button title="Submit" />
      </form>
    </View>
  );
};
export default BowForm;
