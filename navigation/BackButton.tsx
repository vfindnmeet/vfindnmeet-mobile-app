import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Colors, IconButton } from 'react-native-paper';
import { ICON_SIZE } from '../constants';

export default function BackButton() {
  const navigation: any = useNavigation();

  return (
    <IconButton
      size={ICON_SIZE}
      icon="arrow-left"
      style={{
        backgroundColor: Colors.grey300
      }}
      onPress={() => {
        navigation.goBack();
      }}
    />
  );
}
