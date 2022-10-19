import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableWithoutFeedback, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import { ActivityIndicator, Colors, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from "react-redux";
import { BIG_ICON_SIZE } from '../../constants';
import { useIsMounted } from '../../hooks/useIsMounted';
import { reportMedia } from '../../services/api';
import { reportMessageMedia } from '../../store/actions/chat';
import { getLoggedUserIdSelector, getTokenSelector } from "../../store/selectors/auth";
import { handleError, postedAgo, throwErrorIfErrorStatusCode } from '../../utils';
import GameMessage from './GameMessage';
import { messageBackgroundColor } from './QuestionGame/MessageUtils';

const styles = EStyleSheet.create({
  imageLoadingContainer: {
    width: '100%',
    padding: '15rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageReportContainer: {
    padding: '10rem',
    borderRadius: '5rem',
    // borderColor: '#000',
    // borderWidth: 1
  },
  reportButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 1000,
    backgroundColor: Colors.black,
  },
  innerContainer: {
    padding: '7rem',
    borderRadius: '5rem',
  },
  notDeliveredContainer: {
    marginBottom: '5rem',
  },
  notDeliveredText: {
    textAlign: 'right',
    color: Colors.red400,
    fontWeight: 'bold',
    // padding: 5
  }
});

export default function ChatMessage({ chat }: any) {
  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  const { t } = useTranslation();
  const isMounted = useIsMounted();

  const token = useSelector(getTokenSelector);
  const loggedUserId = useSelector(getLoggedUserIdSelector);

  const [size, setSize] = useState<any>(null);
  const [reporting, setReporting] = useState(false);

  const isLoggedUser = loggedUserId === chat.userId;
  const hasImage = !!chat.image;

  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    if (!hasImage) return;

    Image.getSize(chat.image.uri_big, (width, height) => {
      setSize({ width, height });
    });
  }, []);

  const aspectRatio: number = size ? +(size.width / size.height).toFixed(2) : 1;
  const isGame = !!chat.game?.gameStage && +chat.game?.gameStage > 0;

  // console.log('===>', (chat?.game?.gameType == GameType.ANSWER_QUESTIONS && chat?.game?.gameStage == 3));
  // console.log('isGame', isGame, JSON.stringify(chat, null, 2));

  return (
    <>
      {chat.notDelivered && (
        <View style={styles.notDeliveredContainer}>
          <Text style={styles.notDeliveredText}>{t('Not delivered')}</Text>
        </View>
      )}
      <View
        style={{
          display: 'flex',
          flexDirection: isLoggedUser ? 'row-reverse' : 'row',
          marginBottom: !chat.notDelivered ? 5 : undefined,
        }}
      >
        {isGame && <GameMessage message={chat} />}

        {!isGame && (
          <View style={{
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: isLoggedUser ? 'row-reverse' : 'row',
            maxWidth: '80%',
            position: 'relative',
          }}>
            <View style={[styles.innerContainer, {
              backgroundColor: messageBackgroundColor(isLoggedUser),
              width: hasImage ? '100%' : undefined
            }]}>
              <View>
                {loadingImage && (
                  <View style={styles.imageLoadingContainer}>
                    <ActivityIndicator size={BIG_ICON_SIZE} />
                  </View>
                )}
                {!!chat.image && chat.userId !== loggedUserId && chat.imageReported && (
                  <View style={styles.imageReportContainer}>
                    <Text style={{ textAlign: 'center' }}>{t('Image reported.')}</Text>
                  </View>
                )}
                {!!chat.image && (chat.userId === loggedUserId || !chat.imageReported) && (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      navigation.navigate('GalleryDialog', {
                        images: [chat.image]
                      });
                    }}
                  >
                    <View>
                      <Image
                        style={{
                          width: '100%',
                          aspectRatio
                        }}
                        resizeMethod="resize"
                        resizeMode="contain"
                        source={{ uri: chat.image.uri_big }}
                        onLoadStart={() => setLoadingImage(true)}
                        onLoadEnd={() => setLoadingImage(false)}
                      />
                      {!isLoggedUser && (
                        <IconButton
                          style={styles.reportButton}
                          color={Colors.white}
                          icon="flag"
                          disabled={reporting}
                          onPress={() => {
                            if (reporting) return;

                            setReporting(true);

                            reportMedia(chat.id, token)
                              .then(throwErrorIfErrorStatusCode)
                              .then(() => {
                                dispatch(reportMessageMedia(chat.id));
                              })
                              .catch(err => {
                                handleError(err, dispatch);
                              })
                              .finally(() => {
                                if (!isMounted.current) return;

                                setReporting(false);
                              });
                          }}
                        />
                      )}
                    </View>
                  </TouchableWithoutFeedback>
                )}
                {!!chat.text && <Text>{chat.text}</Text>}
              </View>
            </View>
          </View>
        )}
      </View>
    </>
  );
}
