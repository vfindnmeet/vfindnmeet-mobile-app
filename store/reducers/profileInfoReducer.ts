import {
  TYPE_FETCH_PROFILE_SCREEN_INFO,
  TYPE_SET_PROFILE_SCREEN_INFO,
  TYPE_CLEAR_PROFILE_SCREEN_INFO
} from '../actions/profileInfo';
import { TYPE_SET_PROFILE_IMAGE } from '../actions/user';

const INITIAL_STATE: any = {};

export default function profileInfoReducer(state = INITIAL_STATE, action: { type: string, payload: any }) {
  switch (action.type) {
    case TYPE_FETCH_PROFILE_SCREEN_INFO:
      return {
        loading: true
      };
    case TYPE_SET_PROFILE_SCREEN_INFO:
      return {
        info: action.payload,
        loading: false
      };
    case TYPE_SET_PROFILE_IMAGE:
      // console.log('==========:', action.payload);
      // console.log({
      //   ...state,
      //   info: state.info ? {
      //     ...state.info,
      //     profileImage: action.payload
      //   } : null
      // }, '||');
      return {
        ...state,
        info: state.info ? {
          ...state.info,
          profileImage: action.payload
        } : null
      };
    case TYPE_CLEAR_PROFILE_SCREEN_INFO:
      return {
        ...state,
        loading: true
      };
  }

  return state;
}
