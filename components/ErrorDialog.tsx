import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { Button, Paragraph, Dialog, Portal, Provider } from 'react-native-paper';

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
                <MaterialCommunityIcons name="alert-circle" size={ICON_SIZE} color={Colors.yellowA700} />
                <Text>{title ?? 'Error'}</Text>
              </View> */}
              <Text>{title ?? 'Error'}</Text>
            </Dialog.Title>
            <Dialog.Content>
              <Paragraph>{message}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                mode="text"
                uppercase={false}
                onPress={onHide}
              >{t('Ok')}</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
};
