import React from 'react';
import BaseHeader from './BaseHeader';
import { useTranslation } from 'react-i18next';
import BackButton from './BackButton';

export default function SettingsHeader(props: any) {
  const { t } = useTranslation();

  return (
    <BaseHeader
      text={t('Profile info')}
      leftButton={<BackButton />}
    />
  );
}
