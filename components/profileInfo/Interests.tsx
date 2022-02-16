import React, { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Button, Chip, IconButton, TouchableRipple } from 'react-native-paper';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useDispatch, useSelector } from 'react-redux';
import { MAIN_COLOR, MEDIUM_ICON_SIZE } from '../../constants';
import { useIsMounted } from '../../hooks/useIsMounted';
import { setInterests } from '../../services/api';
import { setProfile } from '../../store/actions/profile';
import { getTokenSelector } from '../../store/selectors/auth';
import { getProfileSelector } from '../../store/selectors/profile';
import { throwErrorIfErrorStatusCode } from '../../utils';
import BottomModal from '../BottomModal';
import ItemHeading from './ItemHeading';

const styles = EStyleSheet.create({
  container: {
    marginTop: '10rem',
    padding: '10rem',
    backgroundColor: '#fff',
    borderRadius: '5rem'
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  resultContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  resultItem: {
    margin: '3rem'
  },
  modalTitle: {
    padding: '10rem'
  },
  modalContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  modalItemContainer1: {
    borderRadius: '15rem',
    overflow: 'hidden',
  },
  modalItem: {
    margin: '3rem',
    padding: '5rem',
    paddingLeft: '15rem',
    paddingRight: '15rem',
    borderRadius: '15rem',
  },
});

const sortBySelected = (a: any, b: any) => (a.selected === b.selected) ? 0 : a.selected ? -1 : 1;

export default function Interests(props: { selectedInterests: string[] }) {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const token = useSelector(getTokenSelector);
  const profile: any = useSelector(getProfileSelector);
  const allInterests: any = useSelector(({ common }: any) => common.interests);

  const [editingInterests, setEditingInterests] = useState(false);
  const [editInterests, setEditInterests] = useState<any>([]);

  const [saving, setSaving] = useState(false);

  const hasChangedInterests = () => {
    const a1: string[] = editInterests.filter(({ selected }: any) => selected).map(({ id }: any) => id);

    if (a1.length !== props.selectedInterests.length) {
      return true;
    }

    for (const id of a1) {
      if (!props.selectedInterests.includes(id)) {
        return true;
      }
    }

    return false;
  }

  const onHide = useCallback(() => {
    if (saving) return;

    setEditingInterests(false);
  }, [saving]);

  return (
    <>
      <TouchableRipple
        style={styles.container}
        onPress={() => {
          if (editingInterests) return;

          setEditInterests(
            allInterests.map((interest: any) => ({
              ...interest,
              selected: props.selectedInterests.includes(interest.id)
            }))
              .sort(sortBySelected)
          );

          setEditingInterests(true);
        }}
      >
        <>
          <View style={styles.titleContainer}>
            <ItemHeading>{t('Interests')}</ItemHeading>
            <IconButton
              icon="pencil-outline"
              size={MEDIUM_ICON_SIZE}
              onPress={() => {
                if (editingInterests) return;

                setEditInterests(
                  allInterests.map((interest: any) => ({
                    ...interest,
                    selected: props.selectedInterests.includes(interest.id)
                  }))
                    .sort(sortBySelected)
                );

                setEditingInterests(true);
              }}
            />
          </View>

          <View style={styles.resultContainer}>
            {props.selectedInterests.length === 0 && (
              <Text>{t('Not interests selected yet.')}</Text>
            )}
            {allInterests
              .filter(({ id }: any) => props.selectedInterests.includes(id))
              .map((interest: any) => (
                <Chip
                  key={interest.id}
                  style={styles.resultItem}
                // onPress={() => console.log('Pressed')}
                >{t(interest.name)}</Chip>
              ))}
          </View>
        </>
      </TouchableRipple>

      <BottomModal show={editingInterests} onHide={onHide}>
        <ItemHeading style={styles.modalTitle} onHide={onHide} disabled={saving}>{t('Interests')}</ItemHeading>
        <View style={styles.modalContainer}>
          {editInterests.map((interest: any) => (
            <TouchableOpacity
              key={interest.id}
              style={styles.modalItemContainer1}
              onPress={() => {
                setEditInterests(
                  editInterests.map((item: any) => ({
                    ...item,
                    selected: item.id === interest.id ? !interest.selected : item.selected
                  }))
                    .sort(sortBySelected)
                )
              }}
            >
              <View
                style={[styles.modalItem, {
                  backgroundColor: interest.selected ? MAIN_COLOR : '#d9d9d9',
                }]}
              >
                <Text style={{
                  color: interest.selected ? Colors.white : Colors.black,
                }}>{t(interest.name)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View>
          <Button
            disabled={saving}
            loading={saving}
            uppercase={false}
            onPress={() => {
              if (saving) return;
              if (!hasChangedInterests()) {
                setEditingInterests(false);

                return;
              }

              setSaving(true);

              const selectedInterestIds: string[] = editInterests.filter(({ selected }: any) => selected).map(({ id }: any) => id);
              setInterests(selectedInterestIds, token as string)
                .then(throwErrorIfErrorStatusCode)
                .then(() => {
                  dispatch(setProfile({
                    ...profile,
                    selectedInterests: selectedInterestIds
                  }));

                  if (!isMounted.current) return;

                  setEditingInterests(false);
                })
                .finally(() => {
                  setSaving(false);
                });
            }}>{t('Save')}</Button>
        </View>
      </BottomModal>
    </>
  );
}
