import React from "react";
import { View } from "react-native";
import { Colors } from "react-native-paper";

export default function OnlineBadge({ style }: any) {
  return (
    <View style={{
      width: 10,
      height: 10,
      backgroundColor: Colors.green400,
      borderRadius: 100,
      ...style
    }}></View>
  );
}
