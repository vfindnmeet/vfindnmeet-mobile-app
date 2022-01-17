import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useIsMounted } from '../../hooks/useIsMounted';
import { updateProfile } from '../../services/api';
import { setProfileDescription } from '../../store/actions/profile';
import { getTokenSelector } from '../../store/selectors/auth';
import { throwErrorIfErrorStatusCode } from '../../utils';
import BottomModal from '../BottomModal';
import EditItem from './EditItem';
import ItemHeading from './ItemHeading';

export default function Description({ description }: any) {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();

  const token = useSelector(getTokenSelector);
  const { t } = useTranslation();

  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState('');

  const [saving, setSaving] = useState(false);

  return (
    <>
      <EditItem onPress={() => {
        setEditText(description);
        setEditing(true);
      }}>
        <ItemHeading>{t('About you')}</ItemHeading>
        <Text>{description || t('No bio yet.')}</Text>
      </EditItem>

      <BottomModal show={editing} onHide={() => setEditing(false)}>
        <ItemHeading>{t('About you')}</ItemHeading>
        <TextInput mode='outlined' value={editText} onChangeText={setEditText} />
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
              setSaving(true);

              updateProfile({ description: editText }, token as string)
                .then(throwErrorIfErrorStatusCode)
                .then(() => {
                  dispatch(setProfileDescription(editText));

                  if (!isMounted.current) return;

                  setSaving(false);
                  setEditing(false);
                });
            }}>{t('Save')}</Button>
        </View>
      </BottomModal>
    </>
  );
}
