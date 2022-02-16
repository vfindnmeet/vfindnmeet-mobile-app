import React from 'react';
import { Image, StyleSheet } from "react-native";
import { getDefaultImage } from "./DefaultImages";

const styles = StyleSheet.create({
  image: {
    width: '100%',
    aspectRatio: 1
  }
});

export default function DefaultImage({ gender }: any) {
  return (
    <Image
      style={styles.image}
      source={{ uri: getDefaultImage(gender).uri }}
    />
  );
}
