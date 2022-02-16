import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import BrowseScreen from '../screens/BrowseScreen';
import LikesScreen from '../screens/LikesScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileInfoScreen from '../screens/ProfileInfoScreen';
import { ChatStackScreen } from './Navigator1';

const ICON_SIZE = 30; // 26;
const Tab = createMaterialBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Browse" component={BrowseScreen} options={{
        tabBarLabel: '',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="cards" color={color} size={ICON_SIZE} />
        ),
      }} />
      <Tab.Screen name="Likes" component={LikesScreen} options={{
        tabBarLabel: '',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="heart" color={color} size={ICON_SIZE} />
        ),
      }} />
      <Tab.Screen name="Messages" component={ChatStackScreen} options={
        // tabBarLabel: '',
        // tabBarIcon: ({ color }) => (
        //   <MaterialCommunityIcons name="forum" color={color} size={ICON_SIZE} />
        // ),

        ({ navigation }: any) => {
          // const route = useRoute();
          // console.log('====>', navigation.getState());
          // console.log(navigation);
          // const { routes, index } = navigation.dangerouslyGetState();
          // const { state: exploreState } = routes[index];
          // let tabBarVisible = true;
          // if (exploreState) {
          //   const { routes: exploreRoutes, index: exploreIndex } = exploreState;
          //   const exploreActiveRoute = exploreRoutes[exploreIndex];
          //   console.log('---->', exploreActiveRoute.name);
          //   if (exploreActiveRoute.name === "RewardDetail") tabBarVisible = false;
          // }
          return {
            tabBarVisible: false,
            title: "Explore",
            tabBarLabel: "Explore",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="forum" color={color} size={ICON_SIZE} />
            ),
          };
        }} />
      <Tab.Screen name="Profile" component={ProfileInfoScreen} options={{
        tabBarLabel: '',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="account" color={color} size={ICON_SIZE} />
        ),
      }} />
    </Tab.Navigator>
  );
}
