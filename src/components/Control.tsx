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

const Control = ({onPress}: ControlProps) => (
  <View style={styles.container}>
    <Button onPress={onPress} title={UP_CONTROL} color="#000000" />
    <View style={styles.row}>
      <Button onPress={onPress} title={LEFT_CONTROL} color="#000000" />
      <View style={styles.space} />
      <Button onPress={onPress} title={RIGHT_CONTROL} color="#000000" />
    </View>
    <Button onPress={onPress} title={DOWN_CONTROL} color="#000000" />
  </View>
);

export default Control;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    right: 30,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  space: {width: 20},
});
