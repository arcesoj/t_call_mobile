import React from 'react';
import {SafeAreaView, Text, StyleSheet} from 'react-native';
import {VIRTUAL_SPACE_TITLE} from '../common/constants';
import Avatar from '../components/Avatar';
import Control from '../components/Control';

interface VirtualSpaceProps {
  name: string;
}

const VirtualSpace = ({name}: VirtualSpaceProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{`${VIRTUAL_SPACE_TITLE} ${name}`}</Text>
      <Avatar name={'Fake Name'} />
      <Control onPress={() => {}} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
  },
});

export default VirtualSpace;
