import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

interface AvatarProps {
  name: string;
}

const Avatar = ({name}: AvatarProps) => {
  return (
    <View style={styles.container}>
      <Image source={{uri: ''}} style={styles.image} />
      <Text>{name}</Text>
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  image: {
    backgroundColor: 'blue',
    height: 50,
    width: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  container: {
    alignItems: 'center',
  },
});
