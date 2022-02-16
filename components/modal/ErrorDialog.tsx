import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { getIntroMessageModalDataSelector } from '../../store/selectors/modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { GALELRY_ADD_ICON_SIZE } from '../../constants';

export default function ErrorDialog({ show, onHide }: any) {
  const data = useSelector(getIntroMessageModalDataSelector);

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
                <View>
                  <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <MaterialCommunityIcons name="alert" size={GALELRY_ADD_ICON_SIZE} />
                    <Text style={{
                      fontSize: 25
                    }}>{t('Error')}</Text>
                  </View>
                  <Text style={{
                    padding: 10,
                    textAlign: 'center',
                    color: 'gray',
                    fontSize: 15
                  }}>{t(data.message)}</Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 5
                  }}
                >
                  <Button
                    style={{ margin: 2 }}
                    mode="text"
                    uppercase={false}
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
