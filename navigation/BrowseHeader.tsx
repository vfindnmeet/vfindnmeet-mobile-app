import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { showBrowseOptionModal } from '../store/actions/modal';
import { getStorageItem, parseJson } from '../utils';
import BaseHeader from './BaseHeader';

export default function BrowseHeader() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <BaseHeader
      text={t('Nearby people')}
      leftButton={<IconButton
        icon="tune"
        size={26}
        onPress={() => {
          getStorageItem('vi-browse-options')
            .then(data => parseJson(data as string))
            .then(data => {
              dispatch(showBrowseOptionModal({ onlineOnly: data?.onlineOnly ?? false }));
            });
        }}
      />}
    />
  );
}
