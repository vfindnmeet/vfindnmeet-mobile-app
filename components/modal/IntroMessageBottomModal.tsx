import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { getLoggedUserIdSelector } from '../../store/selectors/auth';
import { getIntroMessageModalDataSelector } from '../../store/selectors/modal';
import BottomModal from '../BottomModal';
import ItemHeading from '../profileInfo/ItemHeading';

const styles = EStyleSheet.create({
  title: {
    fontSize: '23rem',
    fontWeight: 'bold',
    marginBottom: '5rem',
    padding: '10rem',
    paddingBottom: 0,
  },
  messageText: {
    padding: '15rem',
    color: Colors.grey600,
    backgroundColor: Colors.grey100,
  },
});

export default function IntroMessageBottomModal({ show, onHide }: any) {
  const data = useSelector(getIntroMessageModalDataSelector);
  const loggedUserId = useSelector(getLoggedUserIdSelector);

  const { t } = useTranslation();

  const hide = () => {
    onHide();
  };

  return (
    <BottomModal show={show} onHide={onHide} style={{ padding: 0, }}>
      <View>
        {loggedUserId === data.fromUserId ? (
          <ItemHeading
            style={styles.title}
            onHide={hide}
          >{t('Your intro message:')}</ItemHeading>
        ) : (
          <ItemHeading
            style={styles.title}
            onHide={hide}
          >{data.name}{t('\'s intro message to you:')}</ItemHeading>
        )}

        <Text style={styles.messageText}>{data.message}</Text>
      </View>
    </BottomModal>
  );
};
