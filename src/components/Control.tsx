import React from 'react';
import {StyleSheet, Button, View} from 'react-native';
import {
  DOWN_CONTROL,
  LEFT_CONTROL,
  RIGHT_CONTROL,
  UP_CONTROL,
} from '../common/constants';

interface ControlProps {
  onPress: () => void;
}

const Control = ({onPress}: ControlProps) => {
  return (
    <View style={styles.container}>
      <Button onPress={onPress} title={UP_CONTROL} color="#000000" />
      <View style={styles.row}>
        <Button onPress={onPress} title={LEFT_CONTROL} color="#000000" />
        <Button onPress={onPress} title={RIGHT_CONTROL} color="#000000" />
      </View>
      <Button onPress={onPress} title={DOWN_CONTROL} color="#000000" />
    </View>
  );
};

export default Control;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 100,
    right: 50,
  },
  row: {
    flexDirection: 'row',
  },
});
