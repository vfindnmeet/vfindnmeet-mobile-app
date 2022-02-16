import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { LOADER_SIZE } from '../../constants';

export default function PageLoader({ fullScreen = true }: { fullScreen?: boolean }) {
  return (
    <View style={{
      flex: fullScreen ? 1 : undefined,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <ActivityIndicator size={LOADER_SIZE} />
    </View>
  );
}
