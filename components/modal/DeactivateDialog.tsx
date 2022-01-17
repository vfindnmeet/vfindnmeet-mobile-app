import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Button, Colors, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import BadRequestError from '../../errors/BadRequestError';
import { useIsMounted } from '../../hooks/useIsMounted';
import { deactivate } from '../../services/api';
import { logOutUser } from '../../store/actions/auth';
import { getTokenSelector } from '../../store/selectors/auth';
import { throwErrorIfErrorStatusCode } from '../../utils';

export default function DeactivateDialog({ show, onHide }: any) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const { t } = useTranslation();

  // const data = useSelector(getIntroModalDataSelector);
  const token = useSelector(getTokenSelector);

  useEffect(() => {
    if (show) {
      setPassword('');
      setLoading(false);
    }
  }, [show]);

  const hide = () => {
    if (loading) return;

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
              <View>
                <Text style={{
                  fontSize: 23,
                  fontWeight: 'bold',
                  marginBottom: 5
                }}>{t('Confirm password to deactivate account')}</Text>
                <TextInput
                  mode="outlined"
                  placeholder={t('Your password...')}
                  secureTextEntry={true}
                  value={password}
                  onChangeText={setPassword}
                />
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
                    disabled={loading}
                    onPress={hide}
                  >{t('Cancel')}</Button>
                  <Button
                    style={{ margin: 2 }}
                    mode="outlined"
                    disabled={loading}
                    loading={loading}
                    color={Colors.red400}
                    onPress={() => {
                      setLoading(true);
                      deactivate(password, token)
                        .then(throwErrorIfErrorStatusCode)
                        .then(() => {
                          hide();
                          dispatch(logOutUser());

                          if (!isMounted.current) return;

                          setLoading(false);
                        })
                        .catch(err => {
                          if (err instanceof BadRequestError) {
                            setLoading(false);
                          }
                          console.log(err);
                        });
                    }}
                  >{t('Deactivate')}</Button>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
