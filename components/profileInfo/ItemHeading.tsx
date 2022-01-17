import React from 'react';
import { Text } from "react-native";
import { Colors } from 'react-native-paper';

export default function ItemHeading({ children, size, color, marginBottom, style }: any) {
  return (
    <Text style={{
      fontSize: size ?? 20,
      fontWeight: 'bold',
      color: color ?? Colors.black,
      marginBottom,
      ...(style ?? {})
    }}>{children}</Text>
  );
}
