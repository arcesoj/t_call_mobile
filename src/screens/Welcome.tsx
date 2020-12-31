import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {
  WELCOME_TITLE,
  WELCOME_NAME_PLACEHOLDER,
  WELCOME_JOIN,
  WELCOME_ERROR_NAME,
} from '../common/constants';

interface WelcomeProps {
  setValue: (name: string) => void;
}

const Welcome = ({setValue}: WelcomeProps) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const onPress = () => {
    name.trim().length === 0 ? setError(WELCOME_ERROR_NAME) : setValue(name);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{WELCOME_TITLE}</Text>
      <Text style={styles.error}>{error}</Text>
      <TextInput
        value={name}
        style={styles.input}
        placeholder={WELCOME_NAME_PLACEHOLDER}
        onChangeText={(value) => {
          setName(value);
          setError('');
        }}
      />
      <Button onPress={onPress} title={WELCOME_JOIN} color="#000000" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    width: 180,
    backgroundColor: 'white',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
  },
  error: {
    fontSize: 10,
    color: 'red',
    fontWeight: 'bold',
  },
});

export default Welcome;
