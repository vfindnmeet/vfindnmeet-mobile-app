import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { arrayToOptions, setStorageItem } from '../utils';
import BottomModal from './BottomModal';
import EditOptions from './profileInfo/EditOptions';
import ItemHeading from './profileInfo/ItemHeading';

export default function LanguageBottomModal({ show, onHide, lang, setLang }: any) {
  const { i18n, t } = useTranslation();

  const [edit, setEdit] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!show) return;

    setEdit(lang);
  }, [show]);

  return (
    <BottomModal show={show} onHide={onHide}>
      <View style={{
        marginBottom: 15
      }}>
        <ItemHeading>{t('Change your language')}</ItemHeading>
        <EditOptions
          selected={edit}
          setSelected={setEdit}
          showDefault={false}
          options={arrayToOptions([
            ['bg', 'Bulgarian'],
            ['en', 'English']
          ])}
        />
      </View>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 5
      }}>
        <Button
          uppercase={false}
          disabled={saving}
          loading={saving}
          onPress={() => {
            i18n.changeLanguage(edit)
              .then(() => setStorageItem('vi-lang', edit))
              .then(() => {
                setLang(edit);
                setSaving(false);
                onHide();
              });
          }}>{t('Save')}</Button>
      </View>
    </BottomModal>
  );
}
