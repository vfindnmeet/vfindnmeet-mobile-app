import { TYPE_SET_ALL_INTERESTS, TYPE_SET_ALL_PROFILE_QUESTIONS } from "../actions/common";

const INITIAL_STATE: any = {};

export default function commonReducer(state = INITIAL_STATE, action: { type: string, payload: any }) {
  switch (action.type) {
    case TYPE_SET_ALL_INTERESTS:
      return {
        ...state,
        interests: action.payload.interests
      };
    case TYPE_SET_ALL_PROFILE_QUESTIONS:
      return {
        ...state,
        profileQuestions: action.payload.profileQuestions
      };
  }

  return state;
}
