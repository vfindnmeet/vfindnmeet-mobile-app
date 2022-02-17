import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { getIntroMessageModalDataSelector } from '../../store/selectors/modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { GALELRY_ADD_ICON_SIZE } from '../../constants';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    flex: 1
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    padding: '15rem'
  },
  modal: {
    backgroundColor: '#fff',
    padding: '10rem',
    borderRadius: '5rem'
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    fontSize: '25rem'
  },
  messageText: {
    padding: '10rem',
    textAlign: 'center',
    color: 'gray',
    fontSize: '15rem'
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '5rem'
  },
  button: {
    margin: '2rem'
  }
});

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
    >
      <TouchableWithoutFeedback style={styles.container}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.modal}>
              <View>
                <View>
                  <View style={styles.titleContainer}>
                    <MaterialCommunityIcons name="alert" size={GALELRY_ADD_ICON_SIZE} />
                    <Text style={styles.titleText}>{t('Error')}</Text>
                  </View>
                  <Text style={styles.messageText}>{t(data.message)}</Text>
                </View>
                <View style={styles.buttonsContainer}>
                  <Button
                    style={styles.button}
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
