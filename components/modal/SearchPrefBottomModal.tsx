import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Text, TouchableWithoutFeedback, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { ActivityIndicator, Button, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { LOADER_SIZE } from '../../constants';
import { useIsMounted } from '../../hooks/useIsMounted';
import { getSearchPreferences, updateSearchPreferences } from '../../services/api';
import { setSearchPref } from '../../store/actions/searchPref';
import { getTokenSelector } from '../../store/selectors/auth';
import { arrayToOptions, handleError, retryHttpRequest, throwErrorIfErrorStatusCode } from '../../utils';
import BottomModal from '../BottomModal';
import ItemHeading from '../profileInfo/ItemHeading';

const styles = EStyleSheet.create({
  loadingContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '15rem'
  },
  container: {
    padding: '10rem'
  },
  label: {
    // fontSize: 20,
    fontSize: '15rem',
    fontWeight: 'bold'
  },
  sectionContainer: {
    marginBottom: '10rem',
  }
});

export default function SearchPrefBottomModal({ show, onHide }: any) {
  const [fromAge, setFromAge] = useState('');
  const [toAge, setToAge] = useState('');
  const [distance, setDistance] = useState('');
  const [income, setIncome] = useState('high');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  // const [searchPrefereces, setSearchPrefereces] = useState('');

  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const { t } = useTranslation();

  // const data = useSelector(shouldIntroModalData);
  const token = useSelector(getTokenSelector);

  useEffect(() => {
    if (show) {
      setFromAge('');
      setToAge('');
      setDistance('');
      setIncome('');

      setLoading(true);

      retryHttpRequest(() => {
        if (!isMounted.current) return null;

        return getSearchPreferences(token);
      })
        // .then(throwErrorIfErrorStatusCode)
        .then((result: any) => result.json())
        .then(result => {
          // console.log('SEARCH PREF:');
          // console.log(JSON.stringify(result, null, 2));
          setFromAge(result.fromAge.toString());
          setToAge(result.toAge.toString());
          setDistance(result.distance.toString());
          setIncome(result.income);

          // dispatch(setSearchPref(result));

          setLoading(false);
        });
    }
  }, [show]);

  const hide = () => {
    if (saving) return;

    onHide();
  };

  return (
    <BottomModal show={show} onHide={onHide} style={{ padding: 0, }}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={LOADER_SIZE} />
        </View>
      )}
      {!loading && (
        <View style={styles.container}>
          {/* <Text style={{
          fontSize: 30,
          fontWeight: 'bold',
          textAlign: 'center',
          // marginBottom: 15
        }}>{t('Search preference')}</Text> */}
          <ItemHeading style={{ padding: 0 }} onHide={onHide}>{t('Search preference')}</ItemHeading>
          <View style={styles.sectionContainer}>
            <Text style={styles.label}>{t('Radius')}:</Text>
            <TextInput
              mode="outlined"
              placeholder={t('Search radius in KM')}
              value={distance}
              onChangeText={setDistance}
            />
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.label}>{t('Age preference:')}</Text>
            <View style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <TextInput
                style={{ flex: 1 }}
                mode="outlined"
                placeholder={t('From')}
                value={fromAge}
                onChangeText={setFromAge}
              />
              <Text style={{ marginLeft: 10, marginRight: 10 }}>-</Text>
              <TextInput
                style={{ flex: 1 }}
                mode="outlined"
                placeholder={t('To')}
                value={toAge}
                onChangeText={setToAge}
              />
            </View>
          </View>
          {/* <View style={{
                  marginBottom: 10
                }}>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold'
                  }}>{t('Income preference:')}</Text>
                  <EditOptions
                    selected={income}
                    setSelected={setIncome}
                    options={arrayToOptions([
                      ['none', 'No income'],
                      ['low', 'Low income'],
                      ['middle', 'Average income'],
                      ['high', 'High income']
                    ])}></EditOptions>
                </View> */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: 5
            }}
          >
            {/* <Button
            style={{ margin: 2 }}
            mode="outlined"
            disabled={saving}
            onPress={hide}
          >{t('Cancel')}</Button> */}
            <Button
              style={{ margin: 2 }}
              uppercase={false}
              mode="text"
              disabled={saving}
              loading={saving}
              onPress={() => {
                if (saving) return;

                setSaving(true);

                updateSearchPreferences({
                  fromAge,
                  toAge,
                  distance,
                  income
                }, token)
                  .then(throwErrorIfErrorStatusCode)
                  .then(() => {
                    // dispatch(userIntoUpdated(data.userId));
                    if (!isMounted.current) return;

                    dispatch(setSearchPref({
                      fromAge,
                      toAge,
                      distance,
                      income
                    }));

                    // setSaving(false);
                    hide();
                  })
                  .catch(err => {
                    handleError(err, dispatch);
                  })
                  .finally(() => {
                    if (!isMounted.current) return;

                    setSaving(false);
                  });
              }}
            >{t('Save')}</Button>
          </View>
        </View>)}
    </BottomModal>
  )

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      onDismiss={() => {
        console.log('ON DISMISS');
      }}
    >
      <TouchableWithoutFeedback
        style={{ flex: 1 }}
      >
        <View style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          padding: 15
        }}>
          <TouchableWithoutFeedback>
            <View style={{
              backgroundColor: '#fff',
              padding: 10,
              borderRadius: 5
            }}>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
