import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Text, TouchableWithoutFeedback, View } from 'react-native';
import { ActivityIndicator, Button, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useIsMounted } from '../../hooks/useIsMounted';
import { getSearchPreferences, updateSearchPreferences } from '../../services/api';
import { setSearchPref } from '../../store/actions/searchPref';
import { getTokenSelector } from '../../store/selectors/auth';
import { arrayToOptions, retryHttpRequest, throwErrorIfErrorStatusCode } from '../../utils';
import EditOptions from '../profileInfo/EditOptions';

export default function SearchPrefDialog({ show, onHide }: any) {
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

      retryHttpRequest(getSearchPreferences.bind(null, token))
        // .then(throwErrorIfErrorStatusCode)
        .then((result: any) => result.json())
        .then(result => {
          console.log('SEARCH PREF:');
          console.log(JSON.stringify(result, null, 2));
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
              {loading && (
                <View style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 15
                }}>
                  <ActivityIndicator size={70} />
                </View>
              )}
              {!loading && (<View>
                <Text style={{
                  fontSize: 30,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: 15
                }}>{t('Search preference')}</Text>
                <View style={{
                  marginBottom: 10
                }}>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold'
                  }}>{t('Radius:')}</Text>
                  <TextInput
                    mode="outlined"
                    placeholder={t('Search radius in KM')}
                    value={distance}
                    onChangeText={setDistance}
                  />
                </View>
                <View style={{
                  marginBottom: 10
                }}>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold'
                  }}>{t('Age preference:')}</Text>
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
                <View style={{
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
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    marginTop: 5
                  }}
                >
                  <Button
                    style={{ margin: 2 }}
                    mode="outlined"
                    disabled={saving}
                    onPress={hide}
                  >{t('Cancel')}</Button>
                  <Button
                    style={{ margin: 2 }}
                    mode="outlined"
                    disabled={saving}
                    loading={saving}
                    onPress={() => {
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

                          setSaving(false);
                          hide();
                        });
                    }}
                  >{t('Save')}</Button>
                </View>
              </View>)}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
