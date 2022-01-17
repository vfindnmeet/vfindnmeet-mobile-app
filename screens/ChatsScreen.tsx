import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, Button, TouchableWithoutFeedback, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator, Avatar, Divider } from 'react-native-paper';
import CustomHeader from '../navigation/CustomHeader';
import CBottomTabs from '../navigation/CBottomTabs';
import { useIsMounted } from '../hooks/useIsMounted';
import { useDispatch, useSelector } from 'react-redux';
import { getLoggedUserIdSelector, getTokenSelector } from '../store/selectors/auth';
import { getChats } from '../services/api';
import { isVerified, retryHttpRequest, throwErrorIfErrorStatusCode } from '../utils';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getChatsLoadingSelector, getChatsSelector } from '../store/selectors/chat';
import { clearChat, clearChats, fetchChats, setChats } from '../store/actions/chat';
import ItemHeading from '../components/profileInfo/ItemHeading';
import PageLoader from '../components/common/PageLoaded';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDefaultImage } from '../components/DefaultImages';
import UserChatItem from '../components/chat/UserCharItem';
import OnlineBadge from '../components/OnlineBadge';
import VerifiedBadge from '../components/VerifiedBadge';
import { clearRoute, setRoute } from '../store/actions/route';
import BaseHeader from '../navigation/BaseHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useTranslation } from 'react-i18next';
import useRouteTrack from '../hooks/useRouteTrack';

function MatchUser({ chat, onChatOpen }: any) {
  const navigation: any = useNavigation();

  // const chats: any[] = useSelector(getChatsSelector);
  // const foundChat = chats.find(({ chatId }: any) => chatId === chat.chatId);
  // const lastMessage = foundChat?.lastMessage ?? chat.lastMessage;

  // console.log('lastMessage:', lastMessage);
  // console.log('==>', !!lastMessage?.text)

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate('UserChat', { userId: chat.id });
      }}
    >
      <View style={{
        padding: 5,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: chat.notSeen ? 'gray' : undefined,
        // borderWidth: 1,
        // borderColor: Colors.black,
        alignItems: 'center'
      }}>
        <Avatar.Image
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
          style={{
            fontSize: 15,
            textAlign: 'center'
          }}
        >{chat.name}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default function ChatsScreen(props: any) {
  const dispatch = useDispatch();

  useRouteTrack();
  // const route = useRoute();
  // useEffect(() => {
  //   dispatch(setRoute({
  //     routeName: route.name,
  //     params: route.params
  //   }));

  //   return () => {
  //     dispatch(clearRoute());
  //     dispatch(clearChats());
  //   };
  // }, []);

  const chats = useSelector(getChatsSelector);
  const loading = useSelector(getChatsLoadingSelector);

  const isMounted = useIsMounted();
  const token = useSelector(getTokenSelector);
  const { t } = useTranslation();

  // const [matches, setMatches] = useState([]);
  // const [messages, setMessages] = useState([]);

  useEffect(() => {
    dispatch(fetchChats());

    // getChats(token)
    retryHttpRequest(getChats.bind(null, token))
      // .then(throwErrorIfErrorStatusCode)
      .then((result: any) => result.json())
      .then(result => {
        if (!isMounted.current) return;

        dispatch(setChats(result));
      });

    // return () => {
    //   dispatch(clearChat());
    // }
  }, []);

  // useEffect(() => {
  //   // console.log('CHATS CHANGED!!');
  //   if (!chats) return;

  //   setMatches(chats.filter((chat: any) => !chat.lastMessage));
  //   setMessages(chats.filter((chat: any) => chat.lastMessage));
  // }, [chats]);

  if (loading) {
    return (
      <SafeAreaView style={{
        flex: 1
      }}>
        {/* <BaseHeader text="Chats" /> */}
        <PageLoader />
        <CBottomTabs />
      </SafeAreaView>
    );
  }

  const matches: any[] = chats.filter((chat: any) => !chat.lastMessage);
  const messages: any[] = chats.filter((chat: any) => !!chat.lastMessage);

  // console.log('MATCHES:', matches.map(c => ({ id: c.id, lm: !!c.lastMessage })));
  // console.log('MESSAGES:', messages.map(c => ({ id: c.id, lm: !!c.lastMessage })));

  // console.log('CHATS L:', chats.length);

  return (
    <SafeAreaView style={{
      flex: 1
    }}>
      {/* <BaseHeader text="Chats" /> */}
      <View
        style={{
          flex: 1,
          // padding: 5,
          // paddingLeft: 5,
          // paddingRight: 5,
          // display: 'flex',
          // flexDirection: 'column'
        }}
      >
        <View>
          <ItemHeading size={25} style={{ marginLeft: 5 }}>{t('Matches')}</ItemHeading>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              display: 'flex',
              flexDirection: 'row',
              // flex: 0
            }}
          >
            {matches.length <= 0 && (
              <Text style={{ marginLeft: 10 }}>{t('No matches found.')}</Text>
            )}
            {matches.map((chat: any, ix: number) => (
              <MatchUser
                key={chat.id}
                chat={chat}
              />
            ))}
          </ScrollView>
        </View>
        <ItemHeading size={25} style={{ marginLeft: 5 }}>{t('Messages')}</ItemHeading>
        <ScrollView>
          {messages.length <= 0 && (
            <Text style={{ marginLeft: 10 }}>{t('No active chats.')}</Text>
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
