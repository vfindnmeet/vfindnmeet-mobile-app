import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Dimensions, View } from 'react-native';
import { Badge, Colors, IconButton } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { getLikesCountSelector, getNotSeenChatMessagesCountSelector } from '../store/selectors/notification';
import { maxNumber } from '../utils';
import { BADGE_SIZE, MAIN_COLOR } from '../constants';
// import EStyleSheet from 'react-native-extended-stylesheet';

const { width } = Dimensions.get('screen');
const ICON_SIZE = width / 10; //30;

// const Tab = createMaterialBottomTabNavigator();

const getColor = (isActiveRoute: boolean) => isActiveRoute ? MAIN_COLOR : 'gray';

// const styles = EStyleSheet.create({
//   text: {
//     fontSize: '1.5rem',
//     marginHorizontal: '2rem'
//   }
// });

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

      // backgroundColor: Colors.white,
      // shadowColor: Colors.black,
      // shadowOffset: {
      //   width: 0,
      //   height: -3,
      // },
      // shadowOpacity: 1.0,
      // shadowRadius: 4,
      // elevation: 4,

      // borderTopLeftRadius: 5,
      // borderTopRightRadius: 5
    }}>
      <IconButton
        icon="map-marker-outline"
        color={getColor(route.name === 'Browse')}
        size={ICON_SIZE}
        onPress={() => navigation.replace('Browse')}
      />
      <IconButton
        icon="cards-outline"
        color={getColor(route.name === 'Encounters')}
        size={ICON_SIZE}
        onPress={() => navigation.replace('Encounters')}
      />
      {/* <IconButton
        icon="flash-outline"
        color={getColor(route.name === 'Encounters')}
        size={ICON_SIZE}
        onPress={() => navigation.replace('Encounters')}
      /> */}
      <View>
        <IconButton
          icon="heart-outline"
          color={getColor(route.name === 'Likes')}
          size={ICON_SIZE}
          onPress={() => navigation.replace('Likes')}
        />
        <Badge
          visible={!!likesCount}
          size={BADGE_SIZE}
          style={{
            position: 'absolute',
            right: 0
          }}
        >{maxNumber(likesCount, 99)}</Badge>
      </View>
      <View>
        <IconButton
          icon="forum-outline"
          color={getColor(route.name === 'ChatMessages')}
          size={ICON_SIZE}
          onPress={() => navigation.replace('Chats')}
        />
        <Badge
          visible={!!notSeenChatMessagesCount}
          size={BADGE_SIZE}
          style={{
            position: 'absolute',
            right: 0
          }}
        >{maxNumber(notSeenChatMessagesCount, 99)}</Badge>
      </View>
      <IconButton
        icon="account-outline"
        color={getColor(route.name === 'ProfileInfo')}
        size={ICON_SIZE}
        onPress={() => navigation.replace('ProfileInfo')}
      />
      {/* <MaterialCommunityIcons name="cards" size={ICON_SIZE} onPress={() => props.navigation.navigate('Chats')} />
      <MaterialCommunityIcons name="heart" size={ICON_SIZE} />
      <MaterialCommunityIcons name="forum" size={ICON_SIZE} onPress={() => props.navigation.navigate('Chats')} />
      <MaterialCommunityIcons name="account" size={ICON_SIZE} /> */}
    </View>
  );
}
