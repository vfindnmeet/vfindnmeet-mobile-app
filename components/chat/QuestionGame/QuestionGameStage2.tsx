import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import { Button, Colors, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from "react-redux";
import { useIsMounted } from '../../../hooks/useIsMounted';
import { sendChatMessage } from '../../../services/api';
import { getLoggedUserIdSelector, getTokenSelector } from "../../../store/selectors/auth";
import { handleError, throwErrorIfErrorStatusCode } from '../../../utils';
import BottomModal from '../../BottomModal';
import { getDefaultImage } from '../../DefaultImages';
import ItemHeading from '../../profileInfo/ItemHeading';
import GameType from '../GameType';
import BlurredText from './BlurredText';
import ImageColumnItem from './ImageColumnItem';
import ItemTitle from './ItemTitle';
import { gameBackgroundColor } from './MessageUtils';
import QuestionCont from './QuestionCont';

const styles = EStyleSheet.create({
  container: {
    padding: '5rem',
    borderRadius: '5rem',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '100%'
  },
  titleText: {
    fontSize: '14rem'
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  showItemContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    // borderWidth: 1,
    // borderColor: 'red',
  },
  showItemText: {
    fontSize: '16rem',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  answeredText: {
    marginLeft: '30rem',
    marginBottom: '5rem'
  },
  completeContainer: {
    marginLeft: '30rem',
    marginTop: '2rem',
    marginBottom: '5rem'
  },
  completeText: {
    padding: '5rem',
  },
  modalButtonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: '5rem'
  },
});

export default function QuestionGameStage2({ message }: any) {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const token = useSelector(getTokenSelector);
  const loggedUserId = useSelector(getLoggedUserIdSelector);

  const isLoggedUser = loggedUserId === message.userId;

  const hideBottomModal = useCallback(() => setQuestionEdit(false), []);

  const [stageComplete, setStageComplete] = useState(
    !!message.game?.gameData?.toQuestionId &&
    !!message.game?.gameData?.answerTo &&
    !!message.game?.gameData?.answerFrom
  );
  const [showGame, setShowGame] = useState(true);
  const [questionEdit, setQuestionEdit] = useState(false);
  const [answer, setAnswer] = useState('');
  const [answerFrom, setAnswerFrom] = useState('');

  const [loading, setLoading] = useState(false);

  const messageUserProfileImage = useMemo(() => {
    return message?.mupi ?? getDefaultImage(message?.mug).uri;
  }, []);

  const otherUserProfileImage = useMemo(() => {
    return message?.oupi ?? getDefaultImage(message?.oug).uri;
  }, []);

  return (
    <>
      <View style={[styles.container, {
        backgroundColor: gameBackgroundColor(isLoggedUser),
      }]}>
        {!showGame && !isLoggedUser && (
          <View>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>{t('Wants to play')} </Text>
              <ItemTitle textStyle={styles.titleText} />
            </View>
            {!isLoggedUser && (<Button
              onPress={() => {
                setShowGame(true);
              }}
            >{t('Play game')}</Button>)}
          </View>
        )}
        {(showGame || isLoggedUser) && (
          <>
            <View>
              <>
                <View style={styles.showItemContainer}>
                  <ItemTitle textStyle={styles.showItemText} />
                </View>

                <ImageColumnItem uri={otherUserProfileImage}>
                  <QuestionCont>
                    {message?.game?.gameInfo?.questions[message?.game?.gameData?.fromQuestionId]}
                  </QuestionCont>
                </ImageColumnItem>

                <View style={styles.answeredText}>
                  <ImageColumnItem uri={messageUserProfileImage}>
                    <BlurredText text={'da sd lflgfdgdflkgl fd  fdsfs f sf ,blvl'} />
                  </ImageColumnItem>
                </View>

                <ImageColumnItem uri={messageUserProfileImage}>
                  <QuestionCont>
                    {message?.game?.gameInfo?.questions[message?.game?.gameData?.toQuestionId]}
                  </QuestionCont>
                </ImageColumnItem>

                {!stageComplete && !!answerFrom && (
                  <View style={styles.completeContainer}>
                    <ImageColumnItem uri={otherUserProfileImage}>
                      <Text style={styles.completeText}>{answerFrom}</Text>
                    </ImageColumnItem>
                  </View>
                )}
              </>
            </View>

            {!isLoggedUser && !stageComplete && (
              <>
                <View style={styles.buttonContainer}>
                  <Button
                    disabled={loading}
                    mode="text"
                    color={Colors.purple600}
                    onPress={() => {
                      setQuestionEdit(true);
                    }}
                  >{!answerFrom ? t('Select answer') : t('Change answer')}</Button>
                </View>

                <View style={styles.buttonContainer}>
                  <Button
                    mode="text"
                    color={Colors.purple600}
                    disabled={!answerFrom || loading}
                    loading={loading}
                    onPress={() => {
                      if (isLoggedUser || !answerFrom) return;

                      const messageData: {
                        chatId: string;
                        isNew: boolean;
                        gameType: number;
                        gameStage: number;
                        answer: string;
                        gameInfoId: string;
                      } = {
                        chatId: message.chatId,
                        isNew: false,
                        gameStage: 3,
                        gameType: GameType.ANSWER_QUESTIONS,
                        answer: answerFrom,
                        gameInfoId: message?.gameInfoId
                      };

                      setLoading(true);

                      sendChatMessage(message.userId, messageData, token)
                        .then(throwErrorIfErrorStatusCode)
                        .then(() => {
                          if (!isMounted.current) return;

                          setStageComplete(true);
                          // setLoading(false);
                        })
                        .catch(err => {
                          handleError(err, dispatch);
                        })
                        .finally(() => {
                          if (!isMounted.current) return;

                          setLoading(false);
                        });
                    }}
                  >{t('Send')}</Button>
                </View>
              </>
            )}
          </>
        )}
      </View>

      <BottomModal show={questionEdit} onHide={hideBottomModal}>
        <ItemHeading>{t(message?.game?.gameInfo?.questions[message?.game?.gameData?.toQuestionId])}</ItemHeading>
        <TextInput
          mode='outlined'
          // disabled={!currentQuestion.question}
          value={answer}
          placeholder={t('Enter your answer...')}
          onChangeText={setAnswer}
        />

        <View style={styles.modalButtonsContainer}>
          <Button
            uppercase={false}
            onPress={() => {
              setAnswerFrom(answer);
              hideBottomModal();
            }}
          >{t('Save')}</Button>
        </View>
      </BottomModal>
    </>
  );
}
