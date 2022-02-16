import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import { Button, Colors, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from "react-redux";
import { sendChatMessage } from '../../services/api';
import { showGameInfoModal } from '../../store/actions/modal';
import { getLoggedUserIdSelector, getTokenSelector } from "../../store/selectors/auth";
import { handleError, throwErrorIfErrorStatusCode } from '../../utils';
import WouldYouRatherItem from '../common/games/WouldYouRatherItem';
import WRQItem from '../common/games/WRQItem';
import { getDefaultImage } from '../DefaultImages';
import GameType from './GameType';
import { gameBackgroundColor } from './QuestionGame/MessageUtils';

const styles = EStyleSheet.create({
  gameTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  gameTitleText: {
    fontSize: '23rem',
    fontWeight: 'bold',
    marginBottom: '5rem',
    color: '#fff',

    borderRadius: '10rem',
    padding: '5rem',
    paddingLeft: '15rem',
    paddingRight: '15rem',
    backgroundColor: '#000',
    flexShrink: 1,
  },
  gameImageTitleContainer: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center'
  },
  info: {
    marginLeft: '-5rem'
  },
  userImage: {
    width: '40rem',
    borderRadius: 500,
    aspectRatio: 1,
    marginRight: '-2rem'
  },
  titleText1: {
    fontSize: '16rem'
  },
  titleText2: {
    fontSize: '14rem'
  },
  wouldYouRatherItem: {
    fontSize: '13rem',
    padding: 0
  },
  thanContainer: {
    // width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'center',
    // borderColor: 'blue',
    // borderWidth: 1
  },
  thanText: {
    padding: '2rem',
    paddingLeft: '4rem',
    paddingRight: '4rem',
    fontWeight: 'bold',
    backgroundColor: Colors.black,
    color: Colors.white,
    borderRadius: '5rem',

    fontSize: '13rem'
  },

  stage1Container: {
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
    // alignItems: 'flex-start',
    justifyContent: 'flex-end',
    // borderColor: 'red',
    // borderWidth: 1,

    padding: '5rem',
    borderRadius: '5rem',
  },
  answerButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    // width: '100%',
  },
  marginLeft: {
    paddingLeft: '15rem'
  },
  selectAnswerText: {
    color: Colors.purple600,
    fontWeight: '600',
    paddingBottom: '10rem',
    paddingTop: '10rem'
  },
  questionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    // borderWidth: 1,
    // borderColor: 'red',
  },
  questionText: {
    fontSize: '13rem',
    padding: 0
  },
  stage1Container1: {
    padding: '5rem',
    borderRadius: '5rem',
  },
  stage1Container2: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '100%'
  },
});

function WouldYouRatherTitle({ textStyle }: { textStyle?: any }) {
  const { t } = useTranslation();

  return (
    <View style={styles.gameTitleContainer}>
      <Text style={[styles.gameTitleText, textStyle]}>{t('Would you rather ...?')}</Text>
    </View>
  );
}

function WouldYouRatherImageTitle({ uri, gender, showInfo }: { uri: string; gender: string; showInfo?: boolean }) {
  const dispatch = useDispatch();

  return (
    <View style={styles.gameImageTitleContainer}>
      {showInfo && (
        <IconButton
          icon="information-outline"
          style={styles.info}
          onPress={() => {
            dispatch(showGameInfoModal({ gameType: GameType.WOULD_YOU_RATHER }));
          }}
        />
      )}
      <WouldYouRatherTitle
        // text={'I would rather ...'}
        textStyle={styles.titleText1}
      />
      <Image
        source={{ uri: uri ?? getDefaultImage(gender).uri }}
        style={styles.userImage}
      />
    </View>
  )
}

export default function WouldYouRatherMessage({ message }: any) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const token = useSelector(getTokenSelector);
  const loggedUserId = useSelector(getLoggedUserIdSelector);

  const isLoggedUser = loggedUserId === message.userId;

  const [wyrSelected, setWyrSelected] = useState<string | undefined>(
    // chat.game?.gameStage > 1 ? chat.game?.gameData?.answerId : undefined
    message.game?.gameData?.answerId
  );
  const [gameComplete, setGameComplete] = useState(!!message.game?.gameData?.answerId);
  const [showGame, setShowGame] = useState(!!message.game?.gameData?.answerId);

  // console.log('WR', JSON.stringify(message, null, 2));
  // console.log('showGame', showGame, message.game?.gameData?.answerId, null == message.game?.gameData?.answerId, !!message.game?.gameData?.answerId)

  return (
    <View style={{
      // borderWidth: 1,
      // borderColor: 'red',
      width: '80%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: isLoggedUser ? 'flex-end' : 'flex-start',
      justifyContent: 'flex-start',
      // marginBottom: 20
    }}>
      {message?.game?.gameStage > 1 && (
        <View style={[styles.stage1Container, {
          alignItems: isLoggedUser ? 'flex-end' : 'flex-start',
          backgroundColor: gameBackgroundColor(isLoggedUser),
        }]}>
          <WouldYouRatherImageTitle
            showInfo={message.game?.gameStage == 1}
            uri={message.oupi}
            gender={message.oug}
          />
          <View style={styles.marginLeft}>
            <View style={{
              display: 'flex',
              flexDirection: 'row-reverse',
              alignItems: 'center'
            }}>
              <WRQItem
                answer={message?.game?.gameInfo?.answers?.find((i: any) => i.answerId === message.game?.gameData?.answerId)}
                // colors={['#ccc737', 'orange']}
                uri={message.mupi ?? getDefaultImage(message.mug).uri}
                colors={['gray', 'gray']}
                rotateDeg={'2deg'}
                textStyle={styles.wouldYouRatherItem}
              />

              <Image
                source={{ uri: message.mupi ?? getDefaultImage(message.mug).uri }}
                style={styles.userImage}
              // style={{
              //   width: 35,
              //   borderRadius: 500,
              //   aspectRatio: 1,
              //   marginRight: -2
              // }}
              />
            </View>

            <View style={styles.thanContainer}>
              <Text style={styles.thanText}>{t('than')}</Text>
            </View>
            <WRQItem
              answer={message?.game?.gameInfo?.answers?.find((i: any) => i.answerId !== message.game?.gameData?.answerId)}
              colors={['#ccc737', 'orange']}
              rotateDeg={'2deg'}
              textStyle={styles.wouldYouRatherItem}
            />
          </View>
        </View>
      )}

      {message?.game?.gameStage == 1 && (
        <View style={[styles.stage1Container1, {
          backgroundColor: gameBackgroundColor(isLoggedUser),
        }]}>
          {!showGame && !isLoggedUser && (
            <View>
              <View style={styles.stage1Container2}>
                <Text style={styles.titleText2}>{t('Wants to play')} </Text>
                <WouldYouRatherTitle
                  textStyle={styles.titleText2}
                />
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
                <View style={styles.questionContainer}>
                  <WouldYouRatherImageTitle
                    showInfo={message.game?.gameStage == 1}
                    uri={message.mupi}
                    gender={message.mug}
                  />
                </View>
                <WouldYouRatherItem
                  selected={wyrSelected}
                  onSelect={(isLoggedUser || message.game?.gameType == 2) ? undefined : (s?: string) => {
                    if (gameComplete) return;
                    setWyrSelected(s);
                  }}
                  question={message?.game?.gameInfo}
                  textStyle={styles.questionText}
                />
              </View>

              {!isLoggedUser && !gameComplete && (
                <View style={styles.answerButtonContainer}>
                  {!wyrSelected && (
                    <Text style={styles.selectAnswerText}>{t('PLEASE SELECT ONE ANSWER')}</Text>
                  )}
                  {!!wyrSelected && (<Button
                    mode="text"
                    color={Colors.purple600}
                    onPress={() => {
                      if (isLoggedUser || !wyrSelected) return;

                      const messageData: {
                        chatId: string;
                        isNew: boolean;
                        gameType: number;
                        gameStage: number;
                        questionId: string;
                        answerId: string;
                        gameInfoId: string;
                      } = {
                        chatId: message.chatId,
                        isNew: false,
                        gameStage: 3,
                        gameType: 1,
                        questionId: message?.game?.gameInfo.questionId,
                        answerId: wyrSelected,
                        gameInfoId: message?.gameInfoId
                      };

                      sendChatMessage(message.userId, messageData, token)
                        .then(throwErrorIfErrorStatusCode)
                        .then(() => {
                          setGameComplete(true);
                        })
                        .catch(err => {
                          handleError(err, dispatch);
                        });
                    }}
                  >{t('Select answer')}</Button>)}
                </View>
              )}
            </>
          )}
        </View>
      )}
    </View>
  );
}
