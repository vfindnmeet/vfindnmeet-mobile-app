import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import BaseHeader from './BaseHeader';
import { useTranslation } from 'react-i18next';

export default function SettingsHeader(props: any) {
  const navigation: any = useNavigation();
  const { t } = useTranslation();

  return (
    <BaseHeader
      text={t('Profile info')}
      leftButton={<IconButton
        icon="cog-outline"
        size={26}
        onPress={() => navigation.replace('GeneralSettings')}
      />}
    />
  );
}
