import React, { useCallback } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View } from 'react-native';
import { Badge, Colors, IconButton, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { getHasChatNotificationsSelector, getLikesCountSelector, getNotSeenChatMessagesCountSelector } from '../store/selectors/notification';
import { maxNumber } from '../utils';

const Tab = createMaterialBottomTabNavigator();

const getColor = (isActiveRoute: boolean) => isActiveRoute ? Colors.black : 'gray';

export default function CBottomTabs(props: any) {
  const navigation: any = useNavigation();
  const route = useRoute();

  // const hasChatNotification: boolean = useSelector(getHasChatNotificationsSelector);
  const notSeenChatMessagesCount: number = useSelector(getNotSeenChatMessagesCountSelector);
  const likesCount: number = useSelector(getLikesCountSelector);

  // console.log('notSeenChatMessagesCount:', notSeenChatMessagesCount);
  // console.log('likesCount:', likesCount);
  // console.log('ROUTE:', route.name);

  return (
    <View style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      // borderTopWidth: 1,
      // shadowColor: "black",
      // borderTopColor: 'gray'

      // shadowRadius: 2,
      // shadowOffset: {
      //   width: 0,
      //   height: -3,
      // },
      // shadowColor: '#000000',
      // elevation: 4,
      // shadowOpacity: 1.0,
      backgroundColor: Colors.white,
      shadowColor: Colors.black,
      shadowOffset: {
        width: 0,
        height: -3,
      },
      shadowOpacity: 1.0,
      shadowRadius: 4,
      elevation: 4,

      borderTopLeftRadius: 5,
      borderTopRightRadius: 5
    }}>
      {/* <View style={{
        // shadowRadius: 2,
        // shadowOffset: {
        //   width: 0,
        //   height: -3,
        // },
        // shadowColor: '#000000',
        // elevation: 4,
        // shadowOpacity: 1.0,
        // marginTop: 3,
        // shadowColor: "#000",
        // shadowOffset: {
        //   width: 0,
        //   height: 1,
        // },
        // shadowOpacity: 0.20,
        // shadowRadius: 1.41,

        // elevation: 2,
        // zIndex: 1000
      }}>
        <Text>xx</Text>
      </View> */}
      <IconButton
        icon="map-marker"
        color={getColor(route.name === 'Browse')}
        size={26}
        onPress={() => navigation.replace('Browse')}
      />
      <IconButton
        icon="cards"
        color={getColor(route.name === 'Encounters')}
        size={26}
        onPress={() => navigation.replace('Encounters')}
      />
      <View>
        <IconButton
          icon="heart"
          color={getColor(route.name === 'Likes')}
          size={26}
          onPress={() => navigation.replace('Likes')}
        />
        <Badge
          visible={!!likesCount}
          size={10}
          style={{
            position: 'absolute',
            right: 0
          }}
        >{maxNumber(likesCount, 99)}</Badge>
      </View>
      <View>
        <IconButton
          icon="forum"
          color={getColor(route.name === 'ChatMessages')}
          size={26}
          onPress={() => navigation.replace('Chats')}
        />
        <Badge
          visible={!!notSeenChatMessagesCount}
          size={10}
          style={{
            position: 'absolute',
            right: 0
          }}
        >{maxNumber(notSeenChatMessagesCount, 99)}</Badge>
      </View>
      <IconButton
        icon="account"
        color={getColor(route.name === 'ProfileInfo')}
        size={26}
        onPress={() => navigation.replace('ProfileInfo')}
      />
      {/* <MaterialCommunityIcons name="cards" size={26} onPress={() => props.navigation.navigate('Chats')} />
      <MaterialCommunityIcons name="heart" size={26} />
      <MaterialCommunityIcons name="forum" size={26} onPress={() => props.navigation.navigate('Chats')} />
      <MaterialCommunityIcons name="account" size={26} /> */}
    </View>
  );
}
