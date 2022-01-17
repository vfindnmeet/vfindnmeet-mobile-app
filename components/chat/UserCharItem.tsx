import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { Avatar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { getLoggedUserIdSelector } from '../../store/selectors/auth';
import { useNavigation } from '@react-navigation/native';
import { getChatsSelector } from '../../store/selectors/chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDefaultImage } from '../../components/DefaultImages';
import VerifiedBadge from '../VerifiedBadge';
import OnlineBadge from '../OnlineBadge';
import { isVerified } from '../../utils';
import { useTranslation } from 'react-i18next';

const contStyle = (notSeen: boolean): any => ({
  padding: 5,
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: notSeen ? '#dbdbdb' : undefined
});

export default function UserChatItem({ userChat, onChatOpen }: any) {
  const navigation: any = useNavigation();
  const { t } = useTranslation();

  const loggedUserId = useSelector(getLoggedUserIdSelector);
  const chats: any[] = useSelector(getChatsSelector);

  if (userChat.status !== 'active') {
    return (
      <View style={contStyle(userChat.notSeen)}>
        <Avatar.Image
          source={{
            uri: getDefaultImage(userChat.gender).uri
          }}
        />
        <View style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          marginLeft: 5,
          flex: 1
        }}>
          <Text
            style={{
              fontSize: 18
            }}
          >{t('Deleted user')}</Text>
        </View>
      </View>
    );
  }

  const foundChat = chats.find(({ chatId }: any) => chatId === userChat.chatId);
  const lastMessage = foundChat?.lastMessage ?? userChat.lastMessage;

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate('UserChat', { userId: userChat.id });
      }}
    >
      <View style={{
        padding: 5,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: userChat.notSeen ? '#dbdbdb' : undefined
      }}>
        <Avatar.Image
          source={{
            uri: userChat.profileImage ?? getDefaultImage(userChat.gender).uri
          }}
        />
        <View style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          marginLeft: 5,
          flex: 1
        }}>
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Text
              style={{
                fontSize: 18
              }}
            >{userChat.name}</Text>
            {userChat.isOnline && <OnlineBadge style={{ marginLeft: 5 }} />}
            {isVerified(userChat.verification_status) && <VerifiedBadge style={{ marginLeft: 5 }} />}
          </View>
          {lastMessage?.hasImage && (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              {lastMessage?.userId === loggedUserId && <MaterialCommunityIcons name="reply" size={20} color="gray" />}
              <Text style={{ color: "gray" }}>{t('Sent an image')}</Text>
            </View>
          )}
          {!!lastMessage?.text && !lastMessage?.hasImage && (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row'
              }}
            >
              {lastMessage?.userId === loggedUserId && <MaterialCommunityIcons name="reply" size={20} color="gray" />}
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ color: 'gray' }}
              >{lastMessage.text}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
