import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Button, Colors, HelperText, TextInput, TouchableRipple } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useIsMounted } from '../../hooks/useIsMounted';
import { addFeedback } from '../../services/api';
import { getTokenSelector } from '../../store/selectors/auth';
import { getErrorMessage, handleError, throwErrorIfErrorStatusCode } from '../../utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageMenuDialog from '../ImageMenuDialog';
import UnauthorizedError from '../../errors/UnauthorizedError';
import { logOutUser } from '../../store/actions/auth';
import { ICON_SIZE } from '../../constants';
import EStyleSheet from 'react-native-extended-stylesheet';

enum FeedbackType {
  bug = 'Found a bug',
  feature = 'New feature',
  other = 'Other',
}

// enum ReportType {
//   bug = 'Inappropriate content',
//   feature = 'Abusive language',
//   scam = 'Running a scam',
//   fake = 'Fake profile/photos',
//   underage = 'Underage',
//   other = 'Other'
// }

const styles = EStyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    padding: '15rem'
  },
  dialog: {
    backgroundColor: '#fff',
    padding: '10rem',
    borderRadius: '5rem'
  },
  title: {
    fontSize: '23rem',
    fontWeight: 'bold',
    marginBottom: '5rem'
  },
  info: {
    fontSize: '16rem',
    marginBottom: '5rem',
    padding: '10rem',
    backgroundColor: '#dee0df',
    borderRadius: '5rem'
  },
  selectText: {
    padding: '5rem',
    fontSize: '18rem',
    fontWeight: 'bold',
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '5rem'
  },
  pickFeedback: {
    fontSize: '20rem',
    fontWeight: 'bold',
    padding: '10rem',
    textAlign: 'center'
  },
  categoryButton: {
    marginTop: '15rem',
  }
});

export default function FeedbackDialog({ show, onHide }: any) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [type, setType] = useState<FeedbackType | null>(null);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const { t } = useTranslation();

  const token = useSelector(getTokenSelector);

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
    <>
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
          <View style={styles.backdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.dialog}>
                <View>
                  <Text style={styles.title}>{t('Send us feedback')}</Text>

                  <Text style={styles.info}>{t('If you have found a bug, hove some ideas to improve the app or just want to send general feedback - leave a message!')}</Text>

                  <TouchableRipple
                    onPress={() => setShowTypeModal(true)}
                  >
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%'
                      }}
                    >
                      <Text
                        style={[styles.selectText, {
                          color: type ? Colors.black : 'gray'
                        }]}
                      >
                        {type ?? t('Selected type')}
                      </Text>
                      <MaterialCommunityIcons name="chevron-right" size={ICON_SIZE} />
                    </View>
                  </TouchableRipple>

                  <TextInput
                    mode="outlined"
                    placeholder={t('Details')}
                    value={text}
                    onChangeText={setText}
                  />
                  {!!error && (<HelperText type="error">{t(error)}</HelperText>)}
                  <View
                    style={styles.buttonsContainer}
                  >
                    <Button
                      style={{ margin: 2 }}
                      mode="text"
                      uppercase={false}
                      disabled={loading}
                      onPress={hide}
                    >{t('Close')}</Button>
                    <Button
                      style={{ margin: 2 }}
                      mode="text"
                      uppercase={false}
                      disabled={loading || !type || !text}
                      loading={loading}
                      onPress={() => {
                        if (!type || !text) return;

                        setLoading(true);

                        addFeedback(type, text, token)
                          .then(throwErrorIfErrorStatusCode)
                          .then(() => {
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
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <ImageMenuDialog overlay={'0.3'} show={showTypeModal} onHide={() => {
        // if (deleting || settingProfileImage) {
        //   return;
        // }

        setShowTypeModal(false);
      }}>
        <Text style={styles.pickFeedback}>{t('Pick feedback type:')}</Text>
        {[
          FeedbackType.bug,
          FeedbackType.feature,
          FeedbackType.other,
        ].map((categoryItem, ix) => (
          <Button
            key={ix}
            style={styles.categoryButton}
            mode="text"
            uppercase={false}
            disabled={categoryItem === type}
            onPress={() => {
              setType(categoryItem);
              setShowTypeModal(false);
            }}
          >{t(categoryItem)}</Button>
        ))}
      </ImageMenuDialog>
    </>
  );
};
