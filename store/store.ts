import { combineReducers, createStore } from "redux";
import authReducer from "./reducers/authReducer";
import chatReducer from "./reducers/chatReducer";
import commonReducer from "./reducers/commonReducer";
import encounterReducer from "./reducers/encounterReducer";
import likeReducer from "./reducers/likeReducer";
import modalReducer from "./reducers/modalReducer";
import notificationReducer from "./reducers/notificationReducer";
import onboardingReducer from "./reducers/onboardingReducer";
import profileInfoReducer from "./reducers/profileInfoReducer";
import profileReducer from "./reducers/profileReducer";
import routeReducer from "./reducers/routeReducer";
import searchPrefReducer from "./reducers/searchPrefReducer";
import userReducer from "./reducers/userReducer";

export const store = createStore(combineReducers({
  auth: authReducer,
  profile: profileReducer,
  user: userReducer,
  common: commonReducer,
  onboarding: onboardingReducer,
  chat: chatReducer,
  notification: notificationReducer,
  like: likeReducer,
  modal: modalReducer,
  profileInfo: profileInfoReducer,
  encounter: encounterReducer,
  searchPref: searchPrefReducer,
  route: routeReducer
}));
