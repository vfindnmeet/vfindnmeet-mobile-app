import React, { useContext, useEffect, useState } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import BrowseScreen from '../screens/BrowseScreen';
import LikesScreen from '../screens/LikesScreen';
import ChatsScreen from '../screens/ChatsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileInfoScreen from '../screens/ProfileInfoScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import GalleryDialog from '../components/GalleryDialog';
import GeneralSettingsScreen from '../screens/GeneralSettingsScreen';
import IntroDialog from '../components/modal/IntroDialog';
import { useDispatch, useSelector } from 'react-redux';
import { shouldShowDeactivateModal, shouldShowIntroMessageModal, shouldShowIntroModal, shouldShowMatchModalSelector, shouldShowSearchPrefModal, shouldShowVerifyModalSelector } from '../store/selectors/modal';
import { hideDeactivateModal, hideIntroMessageModal, hideIntroModal, hideMatchModal, hideSearchPrefModal, hideVerifyModal } from '../store/actions/modal';
import EncountersScreen from '../screens/EncountersScreen';
import SearchPrefDialog from '../components/modal/SearchPrefDialog';
import IntroMessageDialog from '../components/modal/IntroMessageDialog';
import DeactivateDialog from '../components/modal/DeactivateDialog';
import SettingsScreen from '../screens/SettingsScreen';
import MatchedDialog from '../components/modal/MatchedDialog';
import { useRoute } from '@react-navigation/native';
import { WsContext } from '../store/WsContext';
import VerifyDialog from '../components/modal/VerifyDialog';
import VerificationScreen from '../screens/VerificationScreen';

const AppStack = createStackNavigator();
const AuthStack = createStackNavigator();
const ChatStack = createStackNavigator();

export const AuthScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name="SignIn"
      component={SignInScreen}
      options={{
        headerShown: false,
        animationEnabled: false,
      }}
    />
    <AuthStack.Screen
      name="SignUp"
      component={SignUpScreen}
      options={{
        headerShown: false,
        animationEnabled: false,
      }}
    />
  </AuthStack.Navigator>
);

export const ChatStackScreen = () => (
  <ChatStack.Navigator>
    <ChatStack.Screen
      name="ChatMessages"
      component={ChatsScreen}
      options={{
        headerShown: false,
        animationEnabled: false,
      }}
    />
    <ChatStack.Screen
      name="UserChat"
      component={ChatScreen}
      options={{
        headerShown: false,
        animationEnabled: false,
      }}
    />
  </ChatStack.Navigator>
);

const Comp1 = ({ children }: any) => {
  const [msg, setMsg] = useState<any>(null);
  const { lastMessage } = useContext(WsContext);

  const route = useRoute();
  console.log('======>');
  console.log(route.name);
  console.log(route.params);
  console.log(route.path);

  useEffect(() => {
    if (!lastMessage) return;
    if (lastMessage.type !== 'msg') return;

    setMsg(lastMessage);
  }, [lastMessage]);

  useEffect(() => {
    if (!msg) return;
    if (
      1
      // current screen is chat with user
    ) {
      // see chat message
    }

    setMsg(null);
  }, [msg]);

  return (
    <>
      {children}
    </>
  );
}

export const AppScreen = () => {
  const dispatch = useDispatch();

  const showIntroModal = useSelector(shouldShowIntroModal);
  const showSearchPrefModal = useSelector(shouldShowSearchPrefModal);
  const showIntroMessageModal = useSelector(shouldShowIntroMessageModal);
  const showDeactivateModal = useSelector(shouldShowDeactivateModal);
  const showMatchModal = useSelector(shouldShowMatchModalSelector);
  const showVerifyModal = useSelector(shouldShowVerifyModalSelector);

  return (
    <>
      <AppStack.Navigator>
        <AppStack.Screen
          name="Browse"
          component={BrowseScreen}
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
        />
        <AppStack.Screen
          name="Encounters"
          component={EncountersScreen}
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
        />
        <AppStack.Screen
          name="Likes"
          component={LikesScreen}
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
        />
        <AppStack.Screen
          name="Chats"
          component={ChatStackScreen}
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
        />
        <AppStack.Screen
          name="ProfileInfo"
          component={ProfileInfoScreen}
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
        />
        <AppStack.Screen
          name="Verification"
          component={VerificationScreen}
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
        />
        <AppStack.Screen
          name="GeneralSettings"
          component={GeneralSettingsScreen}
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
        />
        <AppStack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
        />
        <AppStack.Screen
          name="GalleryDialog"
          component={GalleryDialog}
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
        />
        <AppStack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
        />
        <AppStack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
        />
        <AppStack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
        />
      </AppStack.Navigator>

      <IntroDialog
        show={showIntroModal}
        onHide={() => dispatch(hideIntroModal())}
      />

      <SearchPrefDialog
        show={showSearchPrefModal}
        onHide={() => dispatch(hideSearchPrefModal())}
      />

      <IntroMessageDialog
        show={showIntroMessageModal}
        onHide={() => dispatch(hideIntroMessageModal())}
      />

      <DeactivateDialog
        show={showDeactivateModal}
        onHide={() => dispatch(hideDeactivateModal())}
      />

      {showMatchModal && (
        <MatchedDialog
          show={showMatchModal}
          onHide={() => dispatch(hideMatchModal())}
        />
      )}

      {showVerifyModal && (
        <VerifyDialog
          show={showVerifyModal}
          onHide={() => dispatch(hideVerifyModal())}
        />
      )}
    </>
  );
};
