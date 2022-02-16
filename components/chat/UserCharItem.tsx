import React from 'react';
import { View, Text, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Avatar, Colors } from 'react-native-paper';
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
import { MEDIUM_ICON_SIZE } from '../../constants';
import EStyleSheet from 'react-native-extended-stylesheet';

const MESSAGE_COLOR = Colors.grey600;

const styles = EStyleSheet.create({
  titleText: {
    fontSize: '17.5rem',
  },
  marginLeft: {
    marginLeft: '5rem',
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: '5rem',
    flex: 1
  },
  infoTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  container: {
    padding: '5rem',
    display: 'flex',
    flexDirection: 'row',
  },
  messageInfo: {
    fontSize: '14rem',
    color: MESSAGE_COLOR,
  },
  lastMessageImageContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  lastMessageQuestionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  lastMessageTextContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
});

const { width } = Dimensions.get('screen');
export const IMAGE_SIZE = width / 5.5;

const contStyle = (notSeen: boolean): any => ({
  backgroundColor: notSeen ? '#dbdbdb' : undefined
});

export default function UserChatItem({ userChat, onChatOpen }: any) {
  const navigation: any = useNavigation();
  const { t } = useTranslation();

  const loggedUserId = useSelector(getLoggedUserIdSelector);
  const chats: any[] = useSelector(getChatsSelector);

  if (userChat.status !== 'active') {
    return (
      <View style={[styles.container, contStyle(userChat.notSeen)]}>
        <Avatar.Image
          size={IMAGE_SIZE}
          source={{
            uri: getDefaultImage(userChat.gender).uri
          }}
        />
        <View style={styles.infoContainer}>
          <Text
            style={styles.titleText}
          >{t('Deleted user')}</Text>
        </View>
      </View>
    );
  }

  const foundChat = chats.find(({ chatId }: any) => chatId === userChat.chatId);
  const lastMessage = foundChat?.lastMessage ?? userChat.lastMessage;

  // console.log('userChat:', JSON.stringify(userChat, null, 2));
  // console.log('lastMessage:', JSON.stringify(lastMessage, null, 2));

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate('UserChat', { userId: userChat.id });
      }}
    >
      <View style={[styles.container, {
        backgroundColor: userChat.notSeen ? '#dbdbdb' : undefined
      }]}>
        <Avatar.Image
          size={IMAGE_SIZE}
          source={{
            uri: userChat.profileImage ?? getDefaultImage(userChat.gender).uri
          }}
        />
        <View style={styles.infoContainer}>
          <View style={styles.infoTextContainer}>
            <Text
              style={styles.titleText}
            >{userChat.name}</Text>
            {userChat.isOnline && <OnlineBadge style={styles.marginLeft} />}
            {isVerified(userChat.verification_status) && <VerifiedBadge style={styles.marginLeft} />}
          </View>
          {lastMessage?.hasImage && (
            <View
              style={styles.lastMessageImageContainer}
            >
              {lastMessage?.userId === loggedUserId && <MaterialCommunityIcons name="reply" size={MEDIUM_ICON_SIZE} color={MESSAGE_COLOR} />}
              <MaterialCommunityIcons name="image" size={MEDIUM_ICON_SIZE} color={MESSAGE_COLOR} />
              <Text style={styles.messageInfo}>{t('Sent an image')}</Text>
            </View>
          )}
          {!!lastMessage?.gameInfoId && (
            <View
              style={styles.lastMessageQuestionContainer}
            >
              {lastMessage?.userId === loggedUserId && <MaterialCommunityIcons name="reply" size={MEDIUM_ICON_SIZE} color={MESSAGE_COLOR} />}
              <MaterialCommunityIcons name="ice-pop" size={MEDIUM_ICON_SIZE} color={MESSAGE_COLOR} />
              <Text style={styles.messageInfo}>
                {lastMessage?.game?.gameStage == 1 && t('Want\'s to play a game.')}
                {lastMessage?.game?.gameStage > 1 && (
                  t('Answered a game question')
                )}
              </Text>
            </View>
          )}
          {!!lastMessage?.text && !lastMessage?.hasImage && (
            <View
              style={styles.lastMessageTextContainer}
            >
              {lastMessage?.userId === loggedUserId && <MaterialCommunityIcons name="reply" size={MEDIUM_ICON_SIZE} color={MESSAGE_COLOR} />}
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.messageInfo}
              >{lastMessage.text}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
