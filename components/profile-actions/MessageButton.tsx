import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Colors } from 'react-native-paper';

export default function MessageButton({ userId }: any) {
  const navigation: any = useNavigation();
  const { t } = useTranslation();

  return (
    <Button
      style={{
        width: '100%',
        borderColor: 'gray',
      }}
      color={Colors.blue300}
      icon="comment-text-outline"
      mode="outlined"
      uppercase={false}
      onPress={() => {
        navigation.navigate('UserChat', { userId });
      }}
    >{t('Message')}</Button>
  );
}
