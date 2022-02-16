import React, { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Button, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useIsMounted } from '../../hooks/useIsMounted';
import { updateProfile } from '../../services/api';
import { setProfileDescription } from '../../store/actions/profile';
import { getTokenSelector } from '../../store/selectors/auth';
import { handleError, throwErrorIfErrorStatusCode } from '../../utils';
import BottomModal from '../BottomModal';
import EditItem from './EditItem';
import ItemHeading from './ItemHeading';

const styles = EStyleSheet.create({
  modalTitle: {
    padding: '10rem'
  },
  modalButtonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: '5rem'
  },
});

export default function Description({ description }: any) {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();

  const token = useSelector(getTokenSelector);
  const { t } = useTranslation();

  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState('');

  const [saving, setSaving] = useState(false);

  const onHide = useCallback(() => setEditing(false), []);

  return (
    <>
      <EditItem onPress={() => {
        setEditText(description);
        setEditing(true);
      }}>
        <ItemHeading>{t('About you')}</ItemHeading>
        <Text>{description || t('No bio yet.')}</Text>
      </EditItem>

      <BottomModal show={editing} onHide={onHide} style={{ padding: 0, }}>
        <ItemHeading style={styles.modalTitle} onHide={onHide} disabled={saving}>{t('About you')}</ItemHeading>
        <TextInput
          placeholder={t('Something about you ...')}
          mode='flat'
          value={editText}
          onChangeText={setEditText}
        />
        <View style={styles.modalButtonsContainer}>
          <Button
            uppercase={false}
            disabled={saving}
            loading={saving}
            onPress={() => {
              if (saving) return;

              setSaving(true);

              updateProfile({ description: editText }, token as string)
                .then(throwErrorIfErrorStatusCode)
                .then(() => {
                  dispatch(setProfileDescription(editText));

                  if (!isMounted.current) return;

                  // setSaving(false);
                  setEditing(false);
                })
                .catch(err => {
                  handleError(err, dispatch);
                })
                .finally(() => {
                  if (!isMounted.current) return;

                  setSaving(false);
                });
            }}>{t('Save')}</Button>
        </View>
      </BottomModal>
    </>
  );
}
