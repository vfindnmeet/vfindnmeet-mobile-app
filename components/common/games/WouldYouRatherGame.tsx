import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Modal, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import { ActivityIndicator, Button, Checkbox, Colors, HelperText, IconButton, Menu, Provider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { getWouldYouRatherQuestions, sendChatMessage } from '../../../services/api';
import { addNotDeliveredChatMessage, setWouldYouRatherGameQuestions } from '../../../store/actions/chat';
import { getChatUserSelector, getCurrentChatIdSelector, getHasChatMessagesSelector, getWouldYouRatherQuestionsSelector } from '../../../store/selectors/chat';
import { getErrorMessage, handleError, randomNumberBetween, retryHttpRequest, throwErrorIfErrorStatusCode } from '../../../utils';
import WouldYouRatherItem from './WouldYouRatherItem';
import ImageMenuDialog from '../../ImageMenuDialog';
import { getLoggedUserIdSelector, getTokenSelector } from '../../../store/selectors/auth';
import UnauthorizedError from '../../../errors/UnauthorizedError';
import { logOutUser } from '../../../store/actions/auth';
import { useIsMounted } from '../../../hooks/useIsMounted';
import GameType from '../../chat/GameType';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { BADGE_SIZE, BIG2_ICON_SIZE, MEDIUM_ICON_SIZE } from '../../../constants';
import EStyleSheet from 'react-native-extended-stylesheet';

/*
Show me... game

what you're doing
something people normally wouldn’t see
something that no one knows about you
your mad face
your goofy face
the last thing you ate



show_me_games:
id
user_from_id
user_to_id
user_from_image_id
user_to_image_id
chat_message_id



question_games:
id
user_from_id
user_to_id
question_from_id
answer_from
question_to_id
answer_to
chat_message_id

*/

const styles = EStyleSheet.create({
  modalTitle: {
    fontSize: '20rem',
    fontWeight: 'bold',
    padding: '10rem',
    textAlign: 'center'
  },
  modalButton: {
    marginTop: '15rem'
  },
  navigationContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '20rem',
  },
  titleContainer: {
    // borderRadius: 10,
    // padding: 5,
    // backgroundColor: '#000'
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: '23rem',
    fontWeight: 'bold',
    marginBottom: '5rem',
    color: '#fff',

    borderRadius: '10rem',
    padding: '5rem',
    paddingLeft: '15rem',
    paddingRight: '15rem',
    backgroundColor: '#000',
    flexShrink: 1
  },
  questionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',

    // borderColor: 'blue',
    // borderWidth: 1,
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '15rem',
    width: '100%'
  },
  button: {
    margin: '2rem'
  },
});

enum GameGroup {
  COMMON = 'Common',
  FUN = 'Fun',
  RELATIONSHIP = 'Relationship',
  DATING = 'Dating',
  DIRTY = 'Dirty'
};

enum WouldYouRatherGameStage {
  PROMPT = 1,
  ANSWER_SELECTED = 2,
};

function useWouldYouRatherQuestions() {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  const questions = useSelector(getWouldYouRatherQuestionsSelector);

  useEffect(() => {
    if (questions) return;

    retryHttpRequest(() => {
      if (!isMounted.current) return null;

      return getWouldYouRatherQuestions();
    })
      .then((response: any) => response.json())
      .then(response => {
        dispatch(setWouldYouRatherGameQuestions(response));
      });
  }, []);

  return questions;
}

export default function WouldYouRatherGame({ onClose }: {
  onClose: () => void
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isMounted = useIsMounted();
  // const [index, setIndex] = useState(randomNumberBetween(WOULD_YOU_RATHER.length));

  const [showMenu, setShowMenu] = useState(false);
  const [category, setCategory] = useState<string>(GameGroup.COMMON);
  const [index, setIndex] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const wouldYouRatherQuestions: any = useWouldYouRatherQuestions();

  const currentChatUser = useSelector(getChatUserSelector);
  const currentChatId = useSelector(getCurrentChatIdSelector);
  const token = useSelector(getTokenSelector);
  const hasMessages = useSelector(getHasChatMessagesSelector);
  // const loggedUserId = useSelector(getLoggedUserIdSelector);

  // console.log('wouldYouRatherQuestions:', JSON.stringify(wouldYouRatherQuestions, null, 2));

  useEffect(() => {
    if (!category || !wouldYouRatherQuestions) return;

    setIndex(randomNumberBetween(wouldYouRatherQuestions[category].length));
  }, [category, wouldYouRatherQuestions]);

  if (index === null || !wouldYouRatherQuestions) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <View>
        <View style={styles.navigationContainer}>
          <IconButton
            // disabled={index <= 0}
            // uppercase={false}
            icon="chevron-left"
            color={Colors.white}
            // mode="outlined"
            size={BIG2_ICON_SIZE}
            style={{
              borderColor: Colors.white
            }}
            onPress={() => {
              // if (index <= 0) return;

              setIndex(index <= 0 ? wouldYouRatherQuestions[category].length - 1 : index - 1);
            }}
          />
          <Button
            uppercase={false}
            color={Colors.white}
            mode="outlined"
            style={{
              borderColor: Colors.white
            }}
            onPress={() => {
              // if (index <= 0) return;

              // setIndex(index - 1);
              setShowMenu(true);
            }}
          ><MaterialCommunityIcons name="pen" size={BADGE_SIZE} /> {t('Category')}</Button>
          <IconButton
            icon='chevron-right'
            // disabled={index >= WOULD_YOU_RATHER.length - 1}
            // uppercase={false}
            color={Colors.white}
            // mode="outlined"
            size={BIG2_ICON_SIZE}
            style={{
              borderColor: Colors.white
            }}
            onPress={() => {
              // if (index >= WOULD_YOU_RATHER.length - 1) return;

              setIndex(index >= wouldYouRatherQuestions[category].length - 1 ? 0 : index + 1);
            }}
          />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{t('Would you rather ...?')}</Text>
        </View>

        <View style={styles.questionsContainer}>
          {index >= 0 && index < wouldYouRatherQuestions[category].length && (
            <WouldYouRatherItem
              question={wouldYouRatherQuestions[category][index]}
            />
          )}
        </View>

        {!!error && (<HelperText type="error">{t(error)}</HelperText>)}

        <View
          style={styles.buttonsContainer}
        >
          <Button
            style={styles.button}
            // mode="outlined"
            disabled={sending}
            uppercase={false}
            color={Colors.white}
            mode="contained"
            onPress={onClose}
          >{t('Close')}</Button>
          <Button
            style={styles.button}
            // mode="outlined"
            // disabled={loading}
            // loading={loading}
            color={Colors.white}
            mode="contained"
            uppercase={false}
            disabled={sending}
            loading={sending}
            onPress={() => {
              if (sending) return;
              // setOnlineOnly(checked);
              // hide();
              // console.log('current:');
              // console.log(wouldYouRatherQuestions[category][index]);
              // console.log(currentChatUser, currentChatUser.id);

              const messageData: {
                chatId: string;
                isNew: boolean;
                gameType: number;
                gameStage: number;
                questionId: string;
              } = {
                chatId: currentChatId,
                isNew: !hasMessages,
                gameStage: WouldYouRatherGameStage.PROMPT,
                gameType: GameType.WOULD_YOU_RATHER,
                questionId: wouldYouRatherQuestions[category][index].questionId
              };

              setSending(true);

              // const nowTs = +Date.now();
              // console.log(messageData);
              sendChatMessage(currentChatUser.id, messageData, token)
                .then(throwErrorIfErrorStatusCode)
                .then(() => {
                  onClose();
                })
                // .catch(err => {
                //   handleError(err, dispatch);
                // });
                .catch(err => {
                  if (err instanceof UnauthorizedError) {
                    dispatch(logOutUser());

                    return;
                  }

                  setError(getErrorMessage(err.message));
                })
                .finally(() => {
                  if (!isMounted.current) return;

                  setSending(false);
                });
            }}
          >{t('Send')}</Button>
        </View>
      </View>

      <ImageMenuDialog overlay={'0.3'} show={showMenu} onHide={() => {
        // if (deleting || settingProfileImage) {
        //   return;
        // }

        setShowMenu(false);
      }}>
        <Text style={styles.modalTitle}>{t('Pick questions category:')}</Text>
        {[
          GameGroup.COMMON,
          GameGroup.FUN,
          GameGroup.RELATIONSHIP,
          GameGroup.DATING,
          GameGroup.DIRTY,
        ].map((categoryItem, ix) => (
          <Button
            key={ix}
            style={styles.modalButton}
            mode="text"
            uppercase={false}
            disabled={categoryItem === category}
            // loading={settingProfileImage}
            // disabled={deleting || settingProfileImage}
            onPress={() => {
              setCategory(categoryItem);
              setShowMenu(false);
            }}
          >{t(categoryItem)}</Button>
        ))}
      </ImageMenuDialog>
    </>
  );
}
