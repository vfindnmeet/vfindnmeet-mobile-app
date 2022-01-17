export const TYPE_SET_ALL_INTERESTS = 'set_all_interests';
export const TYPE_SET_ALL_PROFILE_QUESTIONS = 'set_all_profile_questions';

export function setAllInterests(interests: any[]) {
  return {
    type: TYPE_SET_ALL_INTERESTS,
    payload: { interests }
  };
}

export function setAllProfileQuestions(profileQuestions: any[]) {
  return {
    type: TYPE_SET_ALL_PROFILE_QUESTIONS,
    payload: { profileQuestions }
  };
}
