import React from 'react';
import { Image, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row-reverse',
    // flexWrap: 'wrap',
    maxWidth: '100%',

    // borderColor: 'green',
    // borderWidth: 1
  },
  itemContainer: {
    flexShrink: 1,

    // borderColor: 'red',
    // borderWidth: 1
  },
  image: {
    width: '30rem',
    aspectRatio: 1,
    borderRadius: 500,
    marginRight: '-2rem'
  }
});

export default function ImageColumnItem({ uri, children }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        {children}
      </View>
      <Image source={{ uri }} style={styles.image} />
    </View>
  );
}
