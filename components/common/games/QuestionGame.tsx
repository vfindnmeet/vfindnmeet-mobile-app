import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { ActivityIndicator, Button, Colors, HelperText } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { getQuestionGameQuestions, sendChatMessage } from '../../../services/api';
import { getChatUserSelector, getCurrentChatIdSelector, getHasChatMessagesSelector } from '../../../store/selectors/chat';
import { getErrorMessage, handleError, randomNumberBetween, retryHttpRequest, throwErrorIfErrorStatusCode } from '../../../utils';
import ImageMenuDialog from '../../ImageMenuDialog';
import { getLoggedUserIdSelector, getTokenSelector } from '../../../store/selectors/auth';
import UnauthorizedError from '../../../errors/UnauthorizedError';
import { logOutUser } from '../../../store/actions/auth';
import { useIsMounted } from '../../../hooks/useIsMounted';
import GameType from '../../chat/GameType';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
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
  answerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  modalTitle: {
    fontSize: '20rem',
    fontWeight: 'bold',
    padding: '10rem',
    textAlign: 'center'
  },
  modalItem: {
    marginTop: '15rem'
  },
});

enum GameGroup {
  COMMON = 'Common',
  FUN = 'Fun',
  RELATIONSHIP = 'Relationship',
  DATING = 'Dating',
  DIRTY = 'Dirty'
};

enum GameStage {
  PROMPT = 1,
  TYPE_ANSWER = 2,
};

function useAnswerQuestionsGameQuestions() {
  // const dispatch = useDispatch();
  const isMounted = useIsMounted();

  // const questions = useSelector(getWouldYouRatherQuestionsSelector);
  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    if (questions) return;

    retryHttpRequest(() => {
      if (!isMounted.current) return null;

      return getQuestionGameQuestions();
    })
      .then((response: any) => response.json())
      .then(response => {
        // dispatch(setWouldYouRatherGameQuestions(response));
        setQuestions(response);
      });
  }, []);

  return questions;
}

export default function QuestionGame({ onClose, onSave, selectedQuestionId, loading }: {
  onClose: () => void;
  onSave?: (questionId: string, text: string) => void;
  selectedQuestionId?: string;
  loading?: boolean
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isMounted = useIsMounted();

  const [showMenu, setShowMenu] = useState(false);
  const [category, setCategory] = useState<string>(GameGroup.COMMON);
  const [index, setIndex] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const questions: any = useAnswerQuestionsGameQuestions();

  const currentChatUser = useSelector(getChatUserSelector);
  const currentChatId = useSelector(getCurrentChatIdSelector);
  const token = useSelector(getTokenSelector);
  const hasMessages = useSelector(getHasChatMessagesSelector);
  const loggedUserId = useSelector(getLoggedUserIdSelector);

  useEffect(() => {
    if (!category || !questions) return;

    if (selectedQuestionId) {
      setIndex((questions[category] as any[]).findIndex(i => i.questionId === selectedQuestionId));
    } else {
      setIndex(randomNumberBetween(questions[category]?.length ?? 0));
    }
  }, [category, questions, selectedQuestionId]);

  if (index === null || !questions) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <View>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: 20,
        }}>
          <Button
            disabled={loading}
            uppercase={false}
            color={Colors.white}
            mode="outlined"
            style={{
              borderColor: Colors.white
            }}
            onPress={() => {
              // if (index <= 0) return;

              setIndex(index <= 0 ? questions[category].length - 1 : index - 1);
            }}
          ><MaterialCommunityIcons name="chevron-left" /> {t('Prev')}</Button>
          <Button
            disabled={loading}
            uppercase={false}
            color={Colors.white}
            mode="outlined"
            style={{
              borderColor: Colors.white
            }}
            onPress={() => {
              setIndex(index >= questions[category].length - 1 ? 0 : index + 1);
            }}
          >{t('Next')} <MaterialCommunityIcons name="chevron-right" /></Button>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{t('Answer questions ...')}</Text>
        </View>
        <View style={styles.answerContainer}>
          <Text style={{ color: Colors.white }}>{questions[category][index].text ?? '-'}</Text>
        </View>

        {!!error && (<HelperText type="error">{t(error)}</HelperText>)}

        <View
          style={styles.buttonsContainer}
        >
          <Button
            style={styles.button}
            // mode="outlined"
            disabled={loading || sending}
            uppercase={false}
            color={Colors.white}
            mode="contained"
            onPress={onClose}
          >{t('Close')}</Button>
          <Button
            style={styles.button}
            // mode="outlined"
            disabled={loading || sending}
            loading={sending}
            color={Colors.white}
            mode="contained"
            uppercase={false}
            onPress={() => {
              if (sending) return;

              if (onSave) {
                return onSave(
                  questions[category][index].questionId,
                  questions[category][index].text
                );
              }

              const messageData: {
                chatId: string;
                isNew: boolean;
                gameType: number;
                gameStage: number;
                questionId: string;
              } = {
                chatId: currentChatId,
                isNew: !hasMessages,
                gameStage: GameStage.PROMPT,
                gameType: GameType.ANSWER_QUESTIONS,
                questionId: questions[category][index].questionId
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
            style={styles.modalItem}
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
