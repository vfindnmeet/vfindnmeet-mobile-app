import React from 'react';
import { Image } from "react-native";
import { getDefaultImage } from "./DefaultImages";

export default function DefaultImage({ gender }: any) {
  return (
    <Image
      style={{
        width: '100%',
        aspectRatio: 1
      }}
      source={{ uri: getDefaultImage(gender).uri }}
    />
  );
}
