import React, { useCallback } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { shouldShowDeactivateModal, shouldShowErrorModalSelector, shouldShowFeedbackModalSelector, shouldShowGameInfoModalSelector, shouldShowIntroMessageModal, shouldShowIntroModal, shouldShowMatchModalSelector, shouldShowPersonalityInfoModalSelector, shouldShowPersonalityModalSelector, shouldShowSearchPrefModal, shouldShowVerifyModalSelector } from '../store/selectors/modal';
import { hideDeactivateModal, hideErrorModal, hideFeedbackModal, hideGameInfoModal, hideIntroMessageModal, hideIntroModal, hideMatchModal, hidePersonalityInfoModal, hidePersonalityModal, hideSearchPrefModal, hideVerifyModal } from '../store/actions/modal';
import EncountersScreen from '../screens/EncountersScreen';
import DeactivateDialog from '../components/modal/DeactivateDialog';
import SettingsScreen from '../screens/SettingsScreen';
import MatchedDialog from '../components/modal/MatchedDialog';
import VerifyDialog from '../components/modal/VerifyDialog';
import VerificationScreen from '../screens/VerificationScreen';
import ErrorDialog from '../components/modal/ErrorDialog';
import FeedbackDialog from '../components/modal/FeedbackDialog';
import GameInfoDialog from '../components/modal/GameInfoDialog';
import PersonalityDialog from '../components/modal/PersonalityDialog';
import BottomModal from '../components/BottomModal';
// import ItemHeading from '../components/profileInfo/ItemHeading';
import PersonalityInfoBottomModal from '../components/modal/PersonalityInfoBottomModal';
import PickPersonalityScreen from '../screens/PickPersonalityScreen';
import PersonalityQuizScreen from '../screens/PersonalityQuizScreen';
import IntroBottomModal from '../components/modal/IntroBottomModal';
import IntroMessageBottomModal from '../components/modal/IntroMessageBottomModal';
import SearchPrefBottomModal from '../components/modal/SearchPrefBottomModal';

const AppStack = createStackNavigator();
const AuthStack = createStackNavigator();
const ChatStack = createStackNavigator();

// const MIntroDialog = React.memo(IntroDialog);
const MIntroBottomModal = React.memo(IntroBottomModal);
// const MSearchPrefDialog = React.memo(SearchPrefDialog);
const MSearchPrefDialog = React.memo(SearchPrefBottomModal);
// const MIntroMessageDialog = React.memo(IntroMessageDialog);
const MIntroMessageBottomModal = React.memo(IntroMessageBottomModal);
const MDeactivateDialog = React.memo(DeactivateDialog);
const MMatchedDialog = React.memo(MatchedDialog);
const MVerifyDialog = React.memo(VerifyDialog);
const MErrorDialog = React.memo(ErrorDialog);
const MFeedbackDialog = React.memo(FeedbackDialog);
const MGameInfoDialog = React.memo(GameInfoDialog);
const MPersonalityDialog = React.memo(PersonalityDialog);

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

export const AppScreen = () => {
  const dispatch = useDispatch();

  const showIntroModal = useSelector(shouldShowIntroModal);
  const showSearchPrefModal = useSelector(shouldShowSearchPrefModal);
  const showIntroMessageModal = useSelector(shouldShowIntroMessageModal);
  const showDeactivateModal = useSelector(shouldShowDeactivateModal);
  const showMatchModal = useSelector(shouldShowMatchModalSelector);
  const showVerifyModal = useSelector(shouldShowVerifyModalSelector);
  const showErrorModal = useSelector(shouldShowErrorModalSelector);
  const showFeedbackModal = useSelector(shouldShowFeedbackModalSelector);
  const showGameInfoModal = useSelector(shouldShowGameInfoModalSelector);
  const showPersonalityModal = useSelector(shouldShowPersonalityModalSelector);
  const showPersonalityInfoModal = useSelector(shouldShowPersonalityInfoModalSelector);

  const hideIntroM = useCallback(() => dispatch(hideIntroModal()), []);
  const hideSearchPrefM = useCallback(() => dispatch(hideSearchPrefModal()), []);
  const hideIntroMessageM = useCallback(() => dispatch(hideIntroMessageModal()), []);
  const hideDeactivateM = useCallback(() => dispatch(hideDeactivateModal()), []);
  const hideMatchM = useCallback(() => dispatch(hideMatchModal()), []);
  const hideVerifyM = useCallback(() => dispatch(hideVerifyModal()), []);
  const hideErrorM = useCallback(() => dispatch(hideErrorModal()), []);
  const hideFeedback = useCallback(() => dispatch(hideFeedbackModal()), []);
  const hideGameInfoM = useCallback(() => dispatch(hideGameInfoModal()), []);
  const hidePersonalityM = useCallback(() => dispatch(hidePersonalityModal()), []);
  const hidePersonalityInfoM = useCallback(() => dispatch(hidePersonalityInfoModal()), []);

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
          name="PickPersonality"
          component={PickPersonalityScreen}
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
        />
        <AppStack.Screen
          name="PersonalityQuiz"
          component={PersonalityQuizScreen}
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

      <MIntroBottomModal
        show={showIntroModal}
        onHide={hideIntroM}
      />

      <MSearchPrefDialog
        show={showSearchPrefModal}
        onHide={hideSearchPrefM}
      />

      <MIntroMessageBottomModal
        show={showIntroMessageModal}
        onHide={hideIntroMessageM}
      />

      <MDeactivateDialog
        show={showDeactivateModal}
        onHide={hideDeactivateM}
      />

      <MMatchedDialog
        show={showMatchModal}
        onHide={hideMatchM}
      />

      <MVerifyDialog
        show={showVerifyModal}
        onHide={hideVerifyM}
      />

      <MErrorDialog
        show={showErrorModal}
        onHide={hideErrorM}
      />

      <MFeedbackDialog
        show={showFeedbackModal}
        onHide={hideFeedback}
      />

      <MGameInfoDialog
        show={showGameInfoModal}
        onHide={hideGameInfoM}
      />

      <MPersonalityDialog
        show={showPersonalityModal}
        onHide={hidePersonalityM}
      />

      <BottomModal show={showPersonalityInfoModal} onHide={hidePersonalityInfoM}>
        <PersonalityInfoBottomModal onHide={hidePersonalityInfoM}/>
      </BottomModal>
    </>
  );
};
