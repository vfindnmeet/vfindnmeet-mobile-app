import React, { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Button, Colors, IconButton, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useIsMounted } from '../../hooks/useIsMounted';
import { updateProfile } from '../../services/api';
import { setProfile, setProfileDescription } from '../../store/actions/profile';
import { getTokenSelector } from '../../store/selectors/auth';
import { getProfileSelector } from '../../store/selectors/profile';
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
})

export default function Title({ work, education }: any) {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const token = useSelector(getTokenSelector);
  const profile: any = useSelector(getProfileSelector);

  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState('');

  const [editingEducation, setEditingEducation] = useState(false);
  const [editEducation, setEditEducation] = useState('');

  const [saving, setSaving] = useState(false);

  const onWorkHide = useCallback(() => setEditing(false), [setEditing]);
  const onEducatiomHide = useCallback(() => setEditingEducation(false), [setEditingEducation]);

  return (
    <>
      <EditItem onPress={() => {
        setEditText(work);
        setEditing(true);
      }}>
        <ItemHeading>{t('Where do you work')}</ItemHeading>
        <Text>{work || t('No info yet.')}</Text>
      </EditItem>

      <EditItem onPress={() => {
        setEditEducation(education);
        setEditingEducation(true);
      }}>
        <ItemHeading>{t('Where do you study')}</ItemHeading>
        <Text>{education || t('No info yet.')}</Text>
      </EditItem>

      <BottomModal show={editing} onHide={onWorkHide} style={{ padding: 0, }}>
        <ItemHeading style={styles.modalTitle} onHide={onWorkHide} disabled={saving}>{t('Where do you work')}</ItemHeading>
        <TextInput
          placeholder={t('Where do you work ...')}
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

              updateProfile({ work: editText }, token as string)
                .then(throwErrorIfErrorStatusCode)
                .then(() => {
                  dispatch(setProfile({
                    ...profile,
                    work: editText
                  }));

                  if (!isMounted.current) return;

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

      <BottomModal show={editingEducation} onHide={onEducatiomHide} style={{ padding: 0, }}>
        <ItemHeading style={styles.modalTitle} onHide={onEducatiomHide} disabled={saving}>{t('Where do you study')}</ItemHeading>
        <TextInput
          placeholder={t('Where do you study ...')}
          mode='flat'
          value={editEducation}
          onChangeText={setEditEducation}
        />
        <View style={styles.modalButtonsContainer}>
          <Button
            uppercase={false}
            disabled={saving}
            loading={saving}
            onPress={() => {
              if (saving) return;

              setSaving(true);

              updateProfile({ education: editEducation }, token as string)
                .then(throwErrorIfErrorStatusCode)
                .then(() => {
                  dispatch(setProfile({
                    ...profile,
                    education: editEducation
                  }));

                  if (!isMounted.current) return;

                  setEditingEducation(false);
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
