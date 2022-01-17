import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableWithoutFeedback } from 'react-native';
import { ActivityIndicator, Colors, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import ImagePicker1 from '../components/ImagePicker1';
import { useIsMounted } from '../hooks/useIsMounted';
import { deleteFile2, getChat, getChats, sendChatMessage } from '../services/api';
import { addNotDeliveredChatMessage, clearChat, setChat, setChatSeen } from '../store/actions/chat';
import { getLoggedUserIdSelector, getTokenSelector } from '../store/selectors/auth';
import { getChatLoadingSelector, getChatMessagesSelector, getChatUserSelector, getCurrentChatIdSelector, getHasChatMessagesSelector } from '../store/selectors/chat';
import { WsContext } from '../store/WsContext';
import { isVerified, retryHttpRequest, throwErrorIfErrorStatusCode } from '../utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ChatMessages from '../components/chat/ChatMessages';
import PageLoader from '../components/common/PageLoaded';
import { getDefaultImage } from '../components/DefaultImages';
import OnlineBadge from '../components/OnlineBadge';
import VerifiedBadge from '../components/VerifiedBadge';
import { useRoute } from '@react-navigation/native';
import { clearRoute, setRoute } from '../store/actions/route';
import UnauthorizedError from '../errors/UnauthorizedError';
import { logOutUser } from '../store/actions/auth';
import { useTranslation } from 'react-i18next';
import useRouteTrack from '../hooks/useRouteTrack';

const onRemoveImage = async (image: any, token: string) => {
  const response: any = await deleteFile2(image.imageId, token);

  if (response.status != 201) {
    return false;
  }

  return true;
};

export default function ChatScreen({ route, navigation }: any) {
  const dispatch = useDispatch();

  useRouteTrack();
  // const route2 = useRoute();

  // useEffect(() => {
  //   dispatch(setRoute({
  //     routeName: route2.name,
  //     params: route2.params
  //   }));

  //   return () => {
  //     dispatch(clearRoute());
  //   };
  // }, []);

  const isMounted = useIsMounted();
  const { t } = useTranslation();

  const currentChatId = useSelector(getCurrentChatIdSelector);
  const user = useSelector(getChatUserSelector);
  const loading = useSelector(getChatLoadingSelector);
  const hasMessages = useSelector(getHasChatMessagesSelector);
  const messages = useSelector(getChatMessagesSelector);

  const token = useSelector(getTokenSelector);
  const loggedUserId = useSelector(getLoggedUserIdSelector);

  const [message, setMessage] = useState('');
  const [image, setImage] = useState<{ imageId: string; uri_big: string; uri_small: string } | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  const { sendMessage } = useContext(WsContext);

  useEffect(() => {
    retryHttpRequest(getChat.bind(null, route.params.userId, token))
      // getChat(route.params.userId, token)
      // .then(throwErrorIfErrorStatusCode)
      .then((result: any) => result.json())
      .then(result => {
        if (!isMounted.current) return;

        dispatch(setChat(result));
        // dispatch(setChatSeen(result.chatId, true));
      })

    return () => {
      dispatch(clearChat());
    }
  }, []);

  if (loading) {
    return (
      <PageLoader />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <IconButton
            icon="chevron-left"
            color={Colors.black}
            size={30}
            onPress={() => navigation.navigate('ChatMessages')}
          />
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('Profile', { userId: user.id })}
          >
            <View style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <Image
                style={{
                  width: 40,
                  borderRadius: 100,
                  aspectRatio: 1,
                  marginRight: 5
                }}
                source={{ uri: user.profileImage ?? getDefaultImage(user.gender).uri }}
              />
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold'
              }}>{user.name}</Text>
              {user.isOnline && <OnlineBadge style={{ marginLeft: 5 }} />}
              {isVerified(user.verification_status) && <VerifiedBadge style={{ marginLeft: 5 }} />}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </SafeAreaView>

      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <ChatMessages />
      </View>

      <View
        style={{
          borderTopWidth: 1,
          borderColor: 'gray'
        }}
      >
        {(image || imageLoading) && (
          <View style={{
            padding: 5,
            display: 'flex',
            flexDirection: 'row'
          }}>
            <View style={{
              position: 'relative',
              width: 200,
            }}>
              {image && (
                <>
                  <Image
                    style={{
                      width: '100%',
                      aspectRatio: 1
                    }}
                    source={{
                      uri: image.uri_big
                    }}
                  />
                  <IconButton
                    icon="close"
                    size={25}
                    color={Colors.redA700}
                    onPress={async () => {
                      if (imageLoading) return;

                      setImageLoading(true);
                      const removed: boolean = await onRemoveImage(image, token);

                      if (removed && isMounted.current) {
                        setImage(null);
                        setImageLoading(false);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      backgroundColor: '#000',
                      opacity: 0.7,
                      borderRadius: 100,
                      borderWidth: 1,
                    }}
                  />
                </>
              )}
              {imageLoading && (
                <View style={{
                  position: 'absolute',
                  top: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  aspectRatio: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                }}>
                  <ActivityIndicator size={40} />
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
          {(!!messages && messages.filter(({ userId }: any) => userId !== loggedUserId).length > 0) && (
            <ImagePicker1
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
                style={{
                  marginLeft: 5,
                  // marginRight: 5
                }}
                name="plus-circle"
                size={25}
              />
            </ImagePicker1>
          )}
          <TextInput
            placeholder={t('Enter your message...')}
            value={message}
            onChangeText={setMessage}
            style={{
              flex: 1,
              borderWidth: 1,
              borderStartColor: 'gray',
              borderRadius: 30,
              paddingLeft: 10,
              paddingRight: 10,
              marginLeft: 5,
            }}
          />
          <IconButton
            icon="send"
            color={Colors.black}
            size={25}
            onPress={() => {
              if (
                (typeof message !== 'string' || message?.trim() === '') &&
                !image
              ) {
                console.log('---1!', message, image);
                return;
              }
              console.log('---2');

              const messageData: {
                chatId: string;
                isNew: boolean;
                text?: string;
                imageId?: string;
              } = {
                chatId: currentChatId,
                text: message,
                isNew: !hasMessages,

                // tmpId: v4()
              };

              if (image?.imageId) {
                messageData.imageId = image?.imageId
              }

              console.log('msg data:', messageData);
              // sendMessage('msg', messageData);

              const nowTs = +Date.now();
              sendChatMessage(user.id, messageData, token)
                .then(throwErrorIfErrorStatusCode)
                .catch(err => {
                  if (err instanceof UnauthorizedError) {
                    dispatch(logOutUser());
                    return;
                  }

                  console.log('ERR!!')

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
  );
}
