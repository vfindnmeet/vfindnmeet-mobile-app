export const TYPE_FETCH_ONBOARDING_DATA = 'fetch_onboarding_data';
export const TYPE_SET_ONBOARDING_DATA = 'set_onboarding_data';

export function fetchOnboardingData() {
  return {
    type: TYPE_FETCH_ONBOARDING_DATA,
    payload: {}
  };
}

export function setOnboardingData(onboardingData: {
  step: number;
  completed_at: number;
}) {
  return {
    type: TYPE_SET_ONBOARDING_DATA,
    payload: onboardingData
  };
}
