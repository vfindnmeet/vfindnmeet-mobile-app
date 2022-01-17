import React from 'react';
import { View } from "react-native";
import { TouchableRipple } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function EditItem({ children, onPress }: any) {
  return (
    <TouchableRipple
      style={{
        marginTop: 10,
      }}
      onPress={onPress}
    >
      <View style={{
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5
      }}>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <View>{children}</View>
          <MaterialCommunityIcons name="pencil-outline" size={20} />
        </View>
      </View>
    </TouchableRipple>
  );
}
