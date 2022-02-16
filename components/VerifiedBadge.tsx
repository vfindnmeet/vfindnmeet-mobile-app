import React from "react";
import { Colors } from "react-native-paper";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MEDIUM_ICON_SIZE } from "../constants";

export default function VerifiedBadge({ style }: any) {
  return (
    <MaterialCommunityIcons
      name="check-decagram"
      size={MEDIUM_ICON_SIZE}
      color={Colors.blue200}
      style={style ?? {}}
    />
  );
}
