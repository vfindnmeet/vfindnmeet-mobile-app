import React from "react";
import { Colors } from "react-native-paper";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function VerifiedBadge({ style }: any) {
  return (
    <MaterialCommunityIcons
      name="check-decagram"
      size={20}
      color={Colors.blue200}
      style={{
        ...style
      }}
    />
  );
}
