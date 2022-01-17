import React from 'react';
import { View } from 'react-native';

export default function ActionsCont({ children }: any) {
  return (
    <View
      style={{
        margin: 3
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}>
        {children}
      </View>
    </View>
  );
}


