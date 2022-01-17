import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useIsMounted } from '../../hooks/useIsMounted';
import { updateLikeMessage } from '../../services/api';
import { userIntoUpdated, userLiked } from '../../store/actions/like';
import { getLoggedUserIdSelector, getTokenSelector } from '../../store/selectors/auth';
import { getIntroModalDataSelector } from '../../store/selectors/modal';
import { throwErrorIfErrorStatusCode } from '../../utils';

export default function IntroDialog({ show, onHide }: any) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const { t } = useTranslation();

  const data = useSelector(getIntroModalDataSelector);
  const token = useSelector(getTokenSelector);
  const loggedUserId = useSelector(getLoggedUserIdSelector);

  useEffect(() => {
    if (show) {
      setText('');
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
                }}>{t('Send intro message to')} {data.name}</Text>
                <TextInput
                  mode="outlined"
                  placeholder={t('Enter your intro message...')}
                  value={text}
                  onChangeText={setText}
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
                    onPress={() => {
                      setLoading(true);
                      updateLikeMessage(data.likeId, text, token)
                        .then(throwErrorIfErrorStatusCode)
                        .then(() => {
                          dispatch(userIntoUpdated({
                            userId: data.userId,
                            fromUserId: loggedUserId,
                            message: text
                          }));

                          if (!isMounted.current) return;

                          setLoading(false);
                          hide();
                        });
                    }}
                  >{t('Send')}</Button>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
