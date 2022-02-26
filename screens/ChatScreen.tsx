import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { ActivityIndicator, Colors, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import ImagePicker from '../components/ImagePicker';
import { useIsMounted } from '../hooks/useIsMounted';
import { deleteImage, getChat, getChats, getWouldYouRatherQuestions, sendChatMessage } from '../services/api';
import { addNotDeliveredChatMessage, clearChat, setChat, setChatSeen, setWouldYouRatherGameQuestions } from '../store/actions/chat';
import { getLoggedUserIdSelector, getTokenSelector } from '../store/selectors/auth';
import { getChatLoadingSelector, getChatMessagesSelector, getChatUserSelector, getCurrentChatIdSelector, getHasChatMessagesSelector, getWouldYouRatherQuestionsSelector } from '../store/selectors/chat';
import { handleError, isVerified, retryHttpRequest, throwErrorIfErrorStatusCode } from '../utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ChatMessages from '../components/chat/ChatMessages';
import PageLoader from '../components/common/PageLoader';
import { getDefaultImage } from '../components/DefaultImages';
import OnlineBadge from '../components/OnlineBadge';
import VerifiedBadge from '../components/VerifiedBadge';
import UnauthorizedError from '../errors/UnauthorizedError';
import { logOutUser } from '../store/actions/auth';
import { useTranslation } from 'react-i18next';
import useRouteTrack from '../hooks/useRouteTrack';
import { hideIcebreakerModal, showErrorModal, showIcebreakerModal } from '../store/actions/modal';
import IcebreakerPickDialog from '../components/modal/IcebreakerPickDialog';
import { shouldShowIcebreakerModalSelector } from '../store/selectors/modal';
import BackButton from '../navigation/BackButton';
import { BIG_ICON_SIZE, ICON_SIZE } from '../constants';
import EStyleSheet from 'react-native-extended-stylesheet';
import { WsContext } from '../store/WsContext';
import NotFoundError from '../errors/NotFoundError';
import BadRequestError from '../errors/BadRequestError';
import NotFoundUser from '../components/NotFoundUser';

const styles = EStyleSheet.create({
  userContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  userInnerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    width: '40rem',
    borderRadius: 100,
    aspectRatio: 1,
    marginRight: '5rem'
  },
  userName: {
    fontSize: '20rem',
    fontWeight: 'bold'
  },
  chatMessagesContainer: {
    flex: 1,
    backgroundColor: Colors.white
  },
  actionsContainer: {
    borderTopWidth: 1,
    borderColor: 'gray'
  },
  imageContainer: {
    padding: '5rem',
    display: 'flex',
    flexDirection: 'row'
  },
  imagesInnerContainer: {
    position: 'relative',
    width: '200rem',
  },
  uploadImage: {
    width: '100%',
    aspectRatio: 1
  },
  deleteImageButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#000',
    opacity: 0.7,
    borderRadius: 100,
    borderWidth: 1,
  },
  imageLoadingContainer: {
    position: 'absolute',
    top: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderStartColor: 'gray',
    borderRadius: '30rem',
    paddingLeft: '10rem',
    paddingRight: '10rem',
    marginLeft: '5rem',
    padding: '5rem'
  },
  marginLeft: {
    marginLeft: '5rem'
  }
});

const { width, height } = Dimensions.get('screen');

export default function ChatScreen({ route, navigation }: any) {
  const dispatch = useDispatch();

  useRouteTrack();

  const isMounted = useIsMounted();
  const { t } = useTranslation();

  const currentChatId = useSelector(getCurrentChatIdSelector);
  const user = useSelector(getChatUserSelector);
  const loading = useSelector(getChatLoadingSelector);
  const hasMessages = useSelector(getHasChatMessagesSelector);
  const messages = useSelector(getChatMessagesSelector);

  const shouldShowIcebreakerModal = useSelector(shouldShowIcebreakerModalSelector);

  const token = useSelector(getTokenSelector);
  const loggedUserId = useSelector(getLoggedUserIdSelector);

  const [message, setMessage] = useState('');
  const [image, setImage] = useState<{ imageId: string; uri_big: string; uri_small: string } | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  const { sendMessage } = useContext(WsContext);

  useEffect(() => {
    retryHttpRequest(() => {
      if (!isMounted.current) return null;

      return getChat(route.params.userId, token);
    })
      // getChat(route.params.userId, token)
      // .then(throwErrorIfErrorStatusCode)
      .then((result: any) => result.json())
      .then(result => {
        if (!isMounted.current) return;

        dispatch(setChat(result));
        // dispatch(setChatSeen(result.chatId, true));
      })
      .catch(e => {
        if (e instanceof NotFoundError || e instanceof BadRequestError) {
          dispatch(setChat(null));
        } else {
          handleError(e, dispatch);
        }
      });

    return () => {
      dispatch(clearChat());
    }
  }, []);

  if (loading) {
    return (
      <PageLoader />
    );
  }

  if (user?.status !== 'active') {
    return (
      <NotFoundUser headerNav={true} />
    );
  }

  return (
    <>
      <View style={{ flex: 1 }}>
        <SafeAreaView>
          <View style={styles.userContainer}>
            <View style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <BackButton />
              <TouchableWithoutFeedback
                onPress={() => navigation.navigate('Profile', { userId: user.id })}
              >
                <View style={styles.userInnerContainer}>
                  <Image
                    style={styles.image}
                    source={{ uri: user.profileImage ?? getDefaultImage(user.gender).uri }}
                  />
                  <Text style={styles.userName}>{user.name}</Text>
                  {user.isOnline && <OnlineBadge style={styles.marginLeft} />}
                  {isVerified(user.verification_status) && <VerifiedBadge style={styles.marginLeft} />}
                </View>
              </TouchableWithoutFeedback>
            </View>

            <IconButton
              icon="video"
              onPress={() => {
                // sendMessage('call', { calledId: targetId, width, height });
                // setCalledId(targetId);
                // setCallerId(loggedUserId);
                sendMessage('call', { calledId: user.id, width, height });

                navigation.navigate('Call', {
                  calledId: user.id,
                  callerId: loggedUserId,
                });
              }}
            />
          </View>
        </SafeAreaView>

        <View style={styles.chatMessagesContainer}>
          <ChatMessages />
        </View>

        <View style={styles.actionsContainer}>
          {(image || imageLoading) && (
            <View style={styles.imageContainer}>
              <View style={styles.imagesInnerContainer}>
                {image && (
                  <>
                    <Image
                      style={styles.uploadImage}
                      source={{
                        uri: image.uri_big
                      }}
                    />
                    <IconButton
                      icon="close"
                      size={ICON_SIZE}
                      color={Colors.redA700}
                      onPress={async () => {
                        if (imageLoading) return;

                        setImageLoading(true);

                        try {
                          await deleteImage(image.imageId, token).then(throwErrorIfErrorStatusCode);

                          if (isMounted.current) {
                            setImage(null);
                            setImageLoading(false);
                          }
                        } catch (e) {
                          if (e instanceof UnauthorizedError) { }
                          else {
                            dispatch(showErrorModal({ message: 'Internal server error.' }))
                          }
                        }
                      }}
                      style={styles.deleteImageButton}
                    />
                  </>
                )}
                {imageLoading && (
                  <View style={styles.imageLoadingContainer}>
                    <ActivityIndicator size={BIG_ICON_SIZE} />
                  </View>
                )}
              </View>
            </View>
          )}
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <IconButton
              icon="ice-pop"
              color={Colors.black}
              size={ICON_SIZE}
              onPress={() => {
                dispatch(showIcebreakerModal());
              }}
            />
            {(!!messages && messages.filter(({ userId }: any) => userId !== loggedUserId).length > 0) && (
              <ImagePicker
                shouldUpload={() => {
                  if (imageLoading) {
                    return false;
                  }

                  return true;
                }}
                onStartUpload={() => {
                  setImageLoading(true);
                }}
                onUpload={(image: any) => {
                  if (!isMounted.current) return;

                  setImage(image);
                  setImageLoading(false);
                }}
              >
                <MaterialCommunityIcons
                  name="plus-circle"
                  size={ICON_SIZE}
                />
              </ImagePicker>
            )}
            <TextInput
              placeholder={t('Enter your message...')}
              value={message}
              onChangeText={setMessage}
              style={styles.textInput}
            />
            <IconButton
              icon="send"
              color={Colors.black}
              size={ICON_SIZE}
              onPress={() => {
                if (
                  (typeof message !== 'string' || message?.trim() === '') &&
                  !image
                ) {
                  return;
                }

                const messageData: {
                  chatId: string;
                  isNew: boolean;
                  text?: string;
                  imageId?: string;
                } = {
                  chatId: currentChatId,
                  text: message,
                  isNew: !hasMessages,
                };

                if (image?.imageId) {
                  messageData.imageId = image?.imageId
                }

                const nowTs = +Date.now();
                sendChatMessage(user.id, messageData, token)
                  .then(throwErrorIfErrorStatusCode)
                  .catch(err => {
                    if (err instanceof UnauthorizedError) {
                      dispatch(logOutUser());
                      return;
                    }

                    dispatch(addNotDeliveredChatMessage({
                      ...messageData,
                      userId: loggedUserId,
                      notDelivered: true,
                      createdAt: nowTs
                    }));
                  });

                setMessage('');
                setImage(null);
              }}
            />
          </View>
        </View>
      </View>

      <IcebreakerPickDialog
        show={shouldShowIcebreakerModal}
        onHide={() => dispatch(hideIcebreakerModal())}
        onGameSelected={(game: number) => {
          console.log('game selected:', game, typeof game);
        }}
      />
    </>
  );
}
