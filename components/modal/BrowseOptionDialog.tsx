import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Button, Checkbox, Colors } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useIsMounted } from '../../hooks/useIsMounted';
import { getBrowseOptionModalDataSelector } from '../../store/selectors/modal';

export default function BrowseOptionDialog({ show, onHide, onlineOnly, setOnlineOnly }: any) {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const { t } = useTranslation();

  const data: { onlineOnly: boolean } = useSelector(getBrowseOptionModalDataSelector);
  // const token = useSelector(getTokenSelector);

  useEffect(() => {
    // console.log('====>', onlineOnly, data.onlineOnly)
    setChecked(onlineOnly ?? false);
    // if (show) {
    //   setLoading(false);
    // }
  }, [onlineOnly]);

  useEffect(() => {
    if (show) {
      // setChecked(onlineOnly ?? false);
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
                }}>{t('Browse options')}</Text>
                <View style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start'
                }}>
                  <Checkbox
                    status={checked ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked(!checked);
                    }}
                  />
                  <Text>{t('Show online only')}</Text>
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
                      setOnlineOnly(checked);
                      hide();
                    }}
                  >{t('Save')}</Button>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
