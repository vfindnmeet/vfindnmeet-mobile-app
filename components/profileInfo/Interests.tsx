import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { Button, Chip } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useIsMounted } from '../../hooks/useIsMounted';
import { setInterests } from '../../services/api';
import { setProfile } from '../../store/actions/profile';
import { getTokenSelector } from '../../store/selectors/auth';
import { getProfileSelector } from '../../store/selectors/profile';
import { throwErrorIfErrorStatusCode } from '../../utils';
import BottomModal from '../BottomModal';

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

  return (
    <>
      <View style={{
        marginTop: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5
      }}>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <ItemHeading>{t('Interests')}</ItemHeading>
          <Button onPress={() => {
            if (editingInterests) return;

            setEditInterests(
              allInterests.map((interest: any) => ({
                ...interest,
                selected: props.selectedInterests.includes(interest.id)
              }))
                .sort(sortBySelected)
            );

            setEditingInterests(true);
          }}>{t('Edit')}</Button>
        </View>

        <View style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap'
        }}>
          {props.selectedInterests.length === 0 && (
            <Text>{t('Not interests selected yet.')}</Text>
          )}
          {allInterests
            .filter(({ id }: any) => props.selectedInterests.includes(id))
            .map((interest: any) => (
              <Chip
                key={interest.id}
                style={{ margin: 3 }}
                onPress={() => console.log('Pressed')}
              >{t(interest.name)}</Chip>
            ))}
        </View>
      </View>

      <BottomModal show={editingInterests} onHide={() => setEditingInterests(false)}>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <ItemHeading>{t('Interests')}</ItemHeading>
          <Button onPress={() => {
            if (!hasChangedInterests()) {
              setEditingInterests(false);

              return;
            }

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
              });
          }}>{t('Save')}</Button>
        </View>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap'
        }}>
          {editInterests.map((interest: any) => (
            <TouchableOpacity
              key={interest.id}
              style={{
                borderRadius: 15,
                overflow: 'hidden',
              }}
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
                style={{
                  margin: 3,
                  padding: 5,
                  paddingLeft: 15,
                  paddingRight: 15,
                  backgroundColor: interest.selected ? 'pink' : '#d9d9d9',
                  borderRadius: 15,
                }}
              >
                <Text>{t(interest.name)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </BottomModal>
    </>
  );
}

function ItemHeading({ children }: any) {
  return (
    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{children}</Text>
  );
}
