import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

interface AvatarProps {
  name: string;
  isLocal: boolean;
}

const Avatar = ({name, isLocal}: AvatarProps) => (
  <View style={styles.container}>
    <Image
      source={{uri: ''}}
      style={[
        isLocal ? styles.image : [styles.image, {backgroundColor: 'green'}],
      ]}
    />
    <Text>{name.substring(0, 7)}</Text>
  </View>
);

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
