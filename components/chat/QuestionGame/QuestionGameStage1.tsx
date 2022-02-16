import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import { Button, Colors, IconButton, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from "react-redux";
import { useIsMounted } from '../../../hooks/useIsMounted';
import { sendChatMessage } from '../../../services/api';
import { hideQuestionGameModal, showGameInfoModal, showQuestionGameModal } from '../../../store/actions/modal';
import { getLoggedUserIdSelector, getTokenSelector } from "../../../store/selectors/auth";
import { shouldQuestionGameModalSelector } from '../../../store/selectors/modal';
import { handleError, throwErrorIfErrorStatusCode } from '../../../utils';
import BottomModal from '../../BottomModal';
import { getDefaultImage } from '../../DefaultImages';
import QuestionGamePickDialog from '../../modal/QuestionGamePickDialog';
import ItemHeading from '../../profileInfo/ItemHeading';
import GameType from './../GameType';
import ImageColumnItem from './ImageColumnItem';
import ItemTitle from './ItemTitle';
import { gameBackgroundColor } from './MessageUtils';
import QuestionCont from './QuestionCont';

const styles = EStyleSheet.create({
  container: {
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  innerContainer: {
    padding: '5rem',
    borderRadius: '5rem',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    // width: '100%',
  },
  modalButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: '5rem'
  },
  gamePromptContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
  gamePromptText: {
    fontSize: '14rem'
  },
  gamePromptTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  gamePromptInfo: {
    marginLeft: '-5rem'
  },
  gameContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameText: {
    fontSize: '16rem',
  },
  gameCompleteContainer: {
    marginLeft: '30rem',
    marginTop: '2rem',
    marginBottom: '5rem'
  },
  gameCompleteText: {
    padding: '5rem',
  }
});

export default function QuestionGameStage1({ message }: any) {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const token = useSelector(getTokenSelector);
  const loggedUserId = useSelector(getLoggedUserIdSelector);

  const shouldQuestionGameModal = useSelector(shouldQuestionGameModalSelector)
  const isLoggedUser = loggedUserId === message.userId;

  const hideQuestionGameM = useCallback(() => dispatch(hideQuestionGameModal()), []);
  const hideBottomModal = useCallback(() => setQuestionEdit(false), []);

  const [stageComplete, setStageComplete] = useState(!!message.game?.gameData?.toQuestionId && !!message.game?.gameData?.answerTo);
  const [showGame, setShowGame] = useState(!!message.game?.gameData?.toQuestionId && !!message.game?.gameData?.answerTo);
  const [questionEdit, setQuestionEdit] = useState(false);
  const [answer, setAnswer] = useState('');
  const [answerFrom, setAnswerFrom] = useState('');
  const [questionTo, setQuestionTo] = useState<{
    questionId: string;
    text: string;
  }>();

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
        alignItems: isLoggedUser ? 'flex-end' : 'flex-start',
      }]}>
        <View style={[styles.innerContainer, {
          backgroundColor: gameBackgroundColor(isLoggedUser),
        }]}>
          {!showGame && !isLoggedUser && (
            <View>
              <View style={styles.gamePromptContainer}>
                <Text style={styles.gamePromptText}>{t('Wants to play')} </Text>
                <View style={styles.gamePromptTitleContainer}>
                  <ItemTitle textStyle={styles.gamePromptText} />
                  <IconButton
                    icon="information-outline"
                    style={styles.gamePromptInfo}
                    onPress={() => {
                      dispatch(showGameInfoModal({ gameType: GameType.ANSWER_QUESTIONS }));
                    }}
                  />
                </View>
              </View>
              {!isLoggedUser && (
                <Button
                  onPress={() => {
                    setShowGame(true);
                  }}
                >{t('Play game')}</Button>
              )}
            </View>
          )}
          {(showGame || isLoggedUser) && (
            <>
              <View style={styles.gameContainer}>
                <ItemTitle textStyle={styles.gameText} />
                <IconButton
                  icon="information-outline"
                  style={styles.gamePromptInfo}
                  onPress={() => {
                    dispatch(showGameInfoModal({ gameType: GameType.ANSWER_QUESTIONS }));
                  }}
                />
              </View>

              <ImageColumnItem uri={messageUserProfileImage}>
                <QuestionCont>
                  {message?.game?.gameInfo?.questions[message?.game?.gameData?.fromQuestionId]}
                </QuestionCont>
              </ImageColumnItem>

              {!stageComplete && !!answerFrom && (
                <View style={styles.gameCompleteContainer}>
                  <ImageColumnItem uri={otherUserProfileImage}>
                    <Text style={styles.gameCompleteText}>{answerFrom}</Text>
                  </ImageColumnItem>
                </View>
              )}

              {!isLoggedUser && !stageComplete && (
                <>
                  <View style={styles.buttonContainer}>
                    <Button
                      mode="text"
                      color={Colors.purple600}
                      onPress={() => {
                        setQuestionEdit(true);
                      }}
                    >{!answerFrom ? t('Select answer') : t('Change answer')}</Button>
                  </View>
                  {!!questionTo && (
                    <ImageColumnItem uri={otherUserProfileImage}>
                      <QuestionCont>
                        {questionTo.text}
                      </QuestionCont>
                    </ImageColumnItem>
                  )}
                  <View style={styles.buttonContainer}>
                    <Button
                      mode="text"
                      disabled={loading}
                      color={Colors.purple600}
                      onPress={() => {
                        dispatch(showQuestionGameModal({
                          questionId: message?.game?.gameData?.fromQuestionId
                        }));
                      }}
                    >{!!questionTo ? t('Change question') : t('Select question')}</Button>
                  </View>

                  <View style={styles.buttonContainer}>
                    <Button
                      mode="text"
                      color={Colors.purple600}
                      disabled={!questionTo || !answerFrom || loading}
                      loading={loading}
                      onPress={() => {
                        if (isLoggedUser || !questionTo || !answerFrom) return;

                        const messageData: {
                          chatId: string;
                          isNew: boolean;
                          gameType: number;
                          gameStage: number;
                          questionId: string;
                          answer: string;
                          gameInfoId: string;
                        } = {
                          chatId: message.chatId,
                          isNew: false,
                          gameStage: 2,
                          gameType: GameType.ANSWER_QUESTIONS,
                          questionId: questionTo.questionId,
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
      </View>

      <BottomModal show={questionEdit} onHide={hideBottomModal}>
        <ItemHeading>{t(message?.game?.gameInfo?.questions[message?.game?.gameData?.fromQuestionId])}</ItemHeading>
        <TextInput
          mode='outlined'
          // disabled={!currentQuestion.question}
          value={answer}
          placeholder={t('Enter your answer...')}
          onChangeText={setAnswer}
        />

        <View style={styles.modalButtons}>
          <Button
            uppercase={false}
            onPress={() => {
              setAnswerFrom(answer);
              hideBottomModal();
            }}
          >{t('Save')}</Button>
        </View>
      </BottomModal>

      <QuestionGamePickDialog
        show={shouldQuestionGameModal}
        onHide={hideQuestionGameM}
        loading={loading}
        onSave={(questionId: string, text: string) => {
          setQuestionTo({ questionId, text });
          hideQuestionGameM();
        }}
      />
    </>
  );
}
