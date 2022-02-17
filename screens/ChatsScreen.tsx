import React, { useEffect } from 'react';
import { View, Text, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Avatar } from 'react-native-paper';
import CBottomTabs from '../navigation/CBottomTabs';
import { useIsMounted } from '../hooks/useIsMounted';
import { useDispatch, useSelector } from 'react-redux';
import { getTokenSelector } from '../store/selectors/auth';
import { getChats } from '../services/api';
import { handleError, retryHttpRequest } from '../utils';
import { useNavigation } from '@react-navigation/native';
import { getChatsLoadingSelector, getChatsSelector } from '../store/selectors/chat';
import { fetchChats, setChats } from '../store/actions/chat';
import ItemHeading from '../components/profileInfo/ItemHeading';
import PageLoader from '../components/common/PageLoader';
import { getDefaultImage } from '../components/DefaultImages';
import UserChatItem from '../components/chat/UserCharItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import useRouteTrack from '../hooks/useRouteTrack';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  name: {
    // fontSize: '15.5rem',
    fontSize: '15rem',
    textAlign: 'center'
  },
  headingMargin: {
    marginLeft: '5rem',
  },
  noResultsMargin: {
    marginLeft: '10rem',
  },
  userItemContainer: {
    padding: '5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  noChatsTitle: {
    fontSize: '35rem',
    fontWeight: 'bold'
  },
  noChatsText: {
    fontSize: '17rem',
  }
});

const { width } = Dimensions.get('screen');
export const HEADING_SIZE = width / 17.5; // ~22;
export const IMAGE_SIZE = width / 5.5;

function MatchUser({ chat, onChatOpen }: any) {
  const navigation: any = useNavigation();

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate('UserChat', { userId: chat.id });
      }}
    >
      <View style={[styles.userItemContainer, {
        // padding: 5,
        // display: 'flex',
        // flexDirection: 'column',
        // alignItems: 'center',
        backgroundColor: chat.notSeen ? 'gray' : undefined,
      }]}>
        <Avatar.Image
          size={IMAGE_SIZE}
          // <Image
          //   style={{
          //     borderRadius: 500,
          //     width: 60,
          //     aspectRatio: 1
          //   }}
          source={{
            uri: chat.profileImage ?? getDefaultImage(chat.gender).uri
          }}
        />
        <Text
          style={styles.name}
        >{chat.name}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default function ChatsScreen(props: any) {
  const dispatch = useDispatch();

  useRouteTrack();

  const chats = useSelector(getChatsSelector);
  const loading = useSelector(getChatsLoadingSelector);

  const isMounted = useIsMounted();
  const token = useSelector(getTokenSelector);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchChats());

    retryHttpRequest(() => {
      if (!isMounted.current) return null;

      return getChats(token);
    })
      .then((result: any) => result.json())
      .then(result => {
        if (!isMounted.current) return;

        dispatch(setChats(result));
      })
      .catch(e => {
        handleError(e, dispatch);
      });;
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{
        flex: 1
      }}>
        <PageLoader />
        <CBottomTabs />
      </SafeAreaView>
    );
  }

  const matches: any[] = chats.filter((chat: any) => !chat.lastMessage);
  const messages: any[] = chats.filter((chat: any) => !!chat.lastMessage);

  if (chats.length <= 0) {
    return (
      <SafeAreaView style={{
        flex: 1
      }}>
        <View style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={styles.noChatsTitle}>{t('No chats yet.')}</Text>
          <Text style={styles.noChatsText}>{t('Get matches in order to chat.')}</Text>
        </View>

        <CBottomTabs />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{
      flex: 1
    }}>
      <View style={{
        flex: 1,
      }}>
        <View>
          <ItemHeading size={HEADING_SIZE} style={styles.headingMargin}>{t('New Matches')}</ItemHeading>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            {matches.length <= 0 && (
              <Text style={styles.noResultsMargin}>{t('No new matches.')}</Text>
            )}
            {matches.map((chat: any, ix: number) => (
              <MatchUser
                key={chat.id}
                chat={chat}
              />
            ))}
          </ScrollView>
        </View>
        <ItemHeading size={HEADING_SIZE} style={styles.headingMargin}>{t('Messages')}</ItemHeading>
        <ScrollView>
          {messages.length <= 0 && (
            <Text style={styles.noResultsMargin}>{t('No active chats.')}</Text>
          )}
          {messages.map((user: any) => (
            <UserChatItem
              key={user.id}
              userChat={user}
            />
          ))}
        </ScrollView>
      </View>
      <CBottomTabs />
    </SafeAreaView>
  );
}
