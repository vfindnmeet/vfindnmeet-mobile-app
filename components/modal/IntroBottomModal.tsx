import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Button, Checkbox, HelperText, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { STORAGE_SHOW_INTRO_MODAL } from '../../constants';
import UnauthorizedError from '../../errors/UnauthorizedError';
import { useIsMounted } from '../../hooks/useIsMounted';
import { updateLikeMessage } from '../../services/api';
import { logOutUser } from '../../store/actions/auth';
import { userIntoUpdated, userLiked } from '../../store/actions/like';
import { getLoggedUserIdSelector, getTokenSelector } from '../../store/selectors/auth';
import { getIntroModalDataSelector } from '../../store/selectors/modal';
import { getErrorMessage, getStorageItem, handleError, setStorageItem, throwErrorIfErrorStatusCode } from '../../utils';
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
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'flex-end',
    // marginTop: '5rem',
    padding: '5rem',
    paddingTop: 0,
  },
  checkboxCont: {
    marginTop: '5rem',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  button: {
    margin: '2rem',
  }
  // title: {
  //   padding: 10rem
  // }
});

export default function IntroBottomModal({ show, onHide }: any) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showIntroModal, setShowIntroModal] = useState<null | boolean>(null);

  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const { t } = useTranslation();

  const data = useSelector(getIntroModalDataSelector);
  const token = useSelector(getTokenSelector);
  const loggedUserId = useSelector(getLoggedUserIdSelector);

  useEffect(() => {
    getStorageItem(STORAGE_SHOW_INTRO_MODAL)
      .then((checked) => {
        if (!isMounted.current) return;

        setShowIntroModal(checked !== 'false');
      });
  }, [show]);

  useEffect(() => {
    if (show) {
      setText('');
      setError('');
      setLoading(false);
    }
  }, [show]);

  const hide = () => {
    if (loading) return;

    if (data.liked) {
      dispatch(userLiked(data.userId));
    }

    onHide();
  };

  const onCheck = () => {
    const nc = !showIntroModal;

    setStorageItem(STORAGE_SHOW_INTRO_MODAL, nc ? 'true' : 'false')
      .then(() => {
        setShowIntroModal(nc);
      });
  };

  return (
    <BottomModal show={show} onHide={hide} style={{ padding: 0, }}>
      <View>
        {/* <Text style={{
          fontSize: 23,
          fontWeight: 'bold',
          marginBottom: 5,
          padding: 10,
          paddingBottom: 0,
        }}>{t('Send intro message to')} {data.name}</Text> */}
        <ItemHeading
          style={styles.title}
          onHide={hide}
          disabled={loading}
        >{t('Send intro message to')} {data.name}</ItemHeading>

        <TextInput
          mode="flat"
          placeholder={t('Enter your intro message...')}
          value={text}
          onChangeText={setText}
        />

        {!!error && (<HelperText type="error">{t(error)}</HelperText>)}

        {data.liked && (
          <TouchableWithoutFeedback onPress={onCheck}>
            <View style={styles.checkboxCont}>
              <Checkbox
                status={!showIntroModal ? 'checked' : 'unchecked'}
                onPress={onCheck}
              />
              <Text>{t('Don\'t show again after like.')}</Text>
            </View>
          </TouchableWithoutFeedback>
        )}

        <View style={[styles.buttonsContainer, {
          justifyContent: data.liked ? 'space-between' : 'flex-end',
        }]}>
          {/* <Button
            style={{ margin: 2 }}
            mode="text"
            uppercase={false}
            disabled={loading}
            onPress={hide}
          >{t('Close')}</Button> */}
          {data.liked && (
            <Button
              style={styles.button}
              mode="text"
              uppercase={false}
              disabled={loading}
              onPress={hide}
            >{t('Skip')}</Button>
          )}
          <Button
            style={styles.button}
            mode="text"
            uppercase={false}
            disabled={loading || typeof text !== 'string' || '' === text.trim()}
            loading={loading}
            onPress={() => {
              if (loading || typeof text !== 'string' || '' === text.trim()) return;

              setLoading(true);

              updateLikeMessage(data.likeId, text, token)
                .then(throwErrorIfErrorStatusCode)
                .then(() => {
                  dispatch(userIntoUpdated({
                    userId: data.userId,
                    fromUserId: loggedUserId,
                    message: text
                  }));

                  // if (!isMounted.current) return;
                  // setLoading(false);
                  hide();
                })
                // .catch(err => {
                //   handleError(err, dispatch);
                // })
                .catch(err => {
                  if (err instanceof UnauthorizedError) {
                    dispatch(logOutUser());

                    return;
                  }

                  setError(getErrorMessage(err.message));
                })
                .finally(() => {
                  if (!isMounted.current) return;

                  setLoading(false);
                });
            }}
          >{t('Send')}</Button>
        </View>
      </View>
    </BottomModal>
  );
};
