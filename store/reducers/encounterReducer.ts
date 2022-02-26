import { TYPE_CLEAR_RECOMMENDATIONS, TYPE_FETCH_RECOMMENDATIONS, TYPE_SET_RECOMMENDATIONS } from "../actions/encounter";
import { TYPE_LIKE_USER, TYPE_PASS_USER } from "../actions/like";
import { TYPE_USER_NOT_FOUND } from "../actions/user";

const INITIAL_STATE: any = {};

export default function encounterReducer(state = INITIAL_STATE, action: { type: string, payload: any }) {
  switch (action.type) {
    case TYPE_FETCH_RECOMMENDATIONS:
      return {
        ...state,
        loading: true
      };
    case TYPE_SET_RECOMMENDATIONS:
      return {
        loading: false,
        recommendations: action.payload
      };
    case TYPE_CLEAR_RECOMMENDATIONS:
      return {};
    case TYPE_PASS_USER:
    case TYPE_LIKE_USER: {
      if (!state.recommendations) return state;

      return {
        ...state,
        recommendations: state.recommendations.filter(({ userId }: { userId: string }) => userId !== action.payload.userId)
      };
    }
    // case TYPE_REMOVE_RECOMMENDATION_USER: {
    case TYPE_USER_NOT_FOUND: {
      if (!state.recommendations) return state;

      return {
        ...state,
        recommendations: state.recommendations.filter(({ userId }: { userId: string }) => userId !== action.payload.userId)
      };
    }
  }

  return state;
}
