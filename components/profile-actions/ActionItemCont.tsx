import React from 'react';
import { View } from 'react-native';

export default function ActionItemCont({ children }: any) {
  return (
    <View style={{
      width: '50%',
      padding: 2,
    }}>
      {children}
    </View>
  );
}
