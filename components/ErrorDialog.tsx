import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { Button, Paragraph, Dialog, Portal, Provider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function ErrorDialog({ title, message, show, onHide }: any) {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setVisible(show);
  }, [show]);

  return (
    <Provider>
      <View>
        <Portal>
          <Dialog visible={visible} onDismiss={onHide}>
            <Dialog.Title>
              {/* <View style={{
                display: 'flex',
                flexDirection: 'row',
                alignContent: 'center',
                justifyContent: 'center'
              }}>
                <MaterialCommunityIcons name="alert-circle" size={26} color={Colors.yellowA700} />
                <Text>{title ?? 'Error'}</Text>
              </View> */}
              <Text>{title ?? 'Error'}</Text>
            </Dialog.Title>
            <Dialog.Content>
              <Paragraph>{message}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={onHide}>{t('Ok')}</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
};
