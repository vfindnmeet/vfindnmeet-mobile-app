import { TYPE_FETCH_ONBOARDING_DATA, TYPE_SET_ONBOARDING_DATA } from '../actions/onboarding';

const INITIAL_STATE: any = {};

export default function onboardingReducer(state = INITIAL_STATE, action: { type: string, payload: any }) {
  switch (action.type) {
    case TYPE_SET_ONBOARDING_DATA:
      return {
        ...action.payload
      };
    case TYPE_FETCH_ONBOARDING_DATA:
      return {
        loading: true
      };
  }

  return state;
}
