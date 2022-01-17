import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { getLoggedUserIdSelector } from '../../store/selectors/auth';
import { getIntroMessageModalDataSelector } from '../../store/selectors/modal';

export default function IntroMessageDialog({ show, onHide }: any) {
  const data = useSelector(getIntroMessageModalDataSelector);
  const loggedUserId = useSelector(getLoggedUserIdSelector);

  const { t } = useTranslation();

  const hide = () => {
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
                {loggedUserId === data.fromUserId ? (
                  <Text style={{
                    fontSize: 23,
                    fontWeight: 'bold',
                    marginBottom: 5
                  }}>{t('Your intro message:')}</Text>
                ) : (
                  <Text style={{
                    fontSize: 23,
                    fontWeight: 'bold',
                    marginBottom: 5
                  }}>{data.name}{t('\'s intro message to you:')}</Text>
                )}

                <Text style={{
                  padding: 5,
                  color: 'gray'
                }}>{data.message}</Text>
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
                    onPress={() => {
                      hide();
                    }}
                  >{t('Close')}</Button>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback >
    </Modal >
  );
};
