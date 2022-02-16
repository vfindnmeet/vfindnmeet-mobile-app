import React from 'react';
import { View } from 'react-native';

export default function ActionsCont({ children, style }: any) {
  return (
    <View
      style={style}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',

          justifyContent: 'space-around',
          // ...(style ?? {})
        }}>
        {children}
      </View>
    </View>
  );
}


