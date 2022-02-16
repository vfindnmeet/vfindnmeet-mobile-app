import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Colors, IconButton } from 'react-native-paper';
import { BIG_ICON_SIZE } from '../../constants';
import { BUTTON_SIZE } from './common';

export default function MessageButton({ userId }: any) {
  const navigation: any = useNavigation();
  const { t } = useTranslation();

  return (
    <IconButton
      style={{
        // borderColor: Colors.black,
        // borderWidth: .1,
        padding: 5,

        backgroundColor: Colors.white,
        shadowColor: Colors.black,
        shadowOffset: {
          width: 4,
          height: 0,
        },
        shadowOpacity: 1.0,
        shadowRadius: 4,
        elevation: 14,
      }}
      size={BIG_ICON_SIZE}
      color={Colors.blue300}
      // icon="comment-text-outline"
      icon="comment-text"
      onPress={() => {
        navigation.navigate('UserChat', { userId });
      }}
    />
  );

  return (
    <IconButton
      style={{
        // width: '100%',
        borderColor: Colors.blue300,
        borderWidth: 2
      }}
      size={35}
      color={Colors.blue300}
      icon="comment-text-outline"
      // mode="outlined"
      // uppercase={false}
      onPress={() => {
        navigation.navigate('UserChat', { userId });
      }}
    />
    // <Button
    //   style={{
    //     width: '100%',
    //     borderColor: 'gray',
    //   }}
    //   color={Colors.blue300}
    //   icon="comment-text-outline"
    //   mode="outlined"
    //   uppercase={false}
    //   onPress={() => {
    //     navigation.navigate('UserChat', { userId });
    //   }}
    // >{t('Message')}</Button>
  );
}
