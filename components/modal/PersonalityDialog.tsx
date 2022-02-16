import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useIsMounted } from '../../hooks/useIsMounted';
import { getPersonality } from '../../services/api';
import { getTokenSelector } from '../../store/selectors/auth';
import { handleError, throwErrorIfErrorStatusCode } from '../../utils';
import PersonalityQuiz from '../common/personality/PersonalityQuiz';
import PersonalityInfo from '../common/personality/PersonalityInfo';

export default function PersonalityDialog({ show, onHide }: any) {
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [personality, setPersonality] = useState<any>();

  const isMounted = useIsMounted();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const token = useSelector(getTokenSelector);

  useEffect(() => {
    if (show) {
      // setText('');
      setLoading(true);

      getPersonality(token)
        .then(throwErrorIfErrorStatusCode)
        .then(result => result.json())
        .then(result => {
          if (!isMounted.current) return;

          setPersonality(result?.personality);
          // setPersonality(result?.personality ?? {
          //   personality: 'INTP',
          //   calculation: {
          //     I: 79,
          //     N: 56,
          //     T: 78,
          //     P: 58,
          //   }
          // });
          // setLoading(false);
        })
        .catch(err => {
          handleError(err, dispatch);
        })
        .finally(() => {
          if (!isMounted.current) return;

          setLoading(false);
        });;
    }
  }, [show]);

  const hide = () => {
    if (loading) return;

    onHide();
  };

  console.log(personality);

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
        <ScrollView style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          flex: 1,
          // display: 'flex',
          // justifyContent: 'center',
          position: 'relative',
          // padding: 15
        }}>
          {/* <TouchableWithoutFeedback> */}
          <View style={{
            padding: 15,
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            // borderColor: 'red',
            // borderWidth: 1,
          }}>
            <View style={{
              backgroundColor: '#fff',
              padding: 10,
              borderRadius: 5
            }}>
              <View>
                <Text style={{
                  fontSize: 23,
                  fontWeight: 'bold',
                  marginBottom: 15,
                  textAlign: 'center'
                }}>{t('Your personality')}</Text>

                {!loading && personality && (
                  <PersonalityInfo personality={personality} />
                )}
                {!loading && !personality && (
                  <PersonalityQuiz
                    setCalculating={setCalculating}
                    setPersonality={setPersonality}
                  />
                )}

                {!calculating && (
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 5
                    }}
                  >
                    <Button
                      style={{ marginTop: 10 }}
                      mode="outlined"
                      disabled={loading}
                      onPress={hide}
                    >{t('Close')}</Button>
                    {/* <Button
                        style={{ margin: 2 }}
                        mode="outlined"
                        disabled={loading || !type || !text}
                        loading={loading}
                        onPress={() => {
                          if (!type || !text) return;

                          setLoading(true);
                          addFeedback(type, text, token)
                            .then(throwErrorIfErrorStatusCode)
                            .then(() => {
                              if (!isMounted.current) return;

                              setLoading(false);
                              hide();
                            });
                        }}
                      >{t('Send')}</Button> */}
                  </View>
                )}
              </View>
            </View>
          </View>
          {/* </TouchableWithoutFeedback> */}
        </ScrollView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
