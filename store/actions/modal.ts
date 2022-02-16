export const TYPE_SHOW_ICEBREAKER_MODAL = 'show_icebreaker_modal';
export const TYPE_HIDE_ICEBREAKER_MODAL = 'hide_icebreaker_modal';
export const TYPE_SHOW_VERIFY_MODAL = 'show_verify_modal';
export const TYPE_HIDE_VERIFY_MODAL = 'hide_verify_modal';
export const TYPE_SHOW_ERROR_MODAL = 'show_error_modal';
export const TYPE_HIDE_ERROR_MODAL = 'hide_error_modal';
export const TYPE_SHOW_MATCH_MODAL = 'show_match_modal';
export const TYPE_HIDE_MATCH_MODAL = 'hide_match_modal';
export const TYPE_SHOW_BROWSE_OPTION_MODAL = 'show_browse_option_modal';
export const TYPE_HIDE_BROWSE_OPTION_MODAL = 'hide_browse_option_modal';
export const TYPE_SHOW_DEACTIVATE_MODAL = 'show_deactivate_modal';
export const TYPE_HIDE_DEACTIVATE_MODAL = 'hide_deactivate_modal';
export const TYPE_SHOW_INTRO_MODAL = 'show_intro_modal';
export const TYPE_HIDE_INTRO_MODAL = 'hide_intro_modal';
export const TYPE_SHOW_SEARCH_PREF_MODAL = 'show_search_pref_modal';
export const TYPE_HIDE_SEARCH_PREF_MODAL = 'hide_search_pref_modal';
export const TYPE_SHOW_INTRO_MESSAGE_MODAL = 'show_intro_message_modal';
export const TYPE_HIDE_INTRO_MESSAGE_MODAL = 'hide_intro_message_modal';
export const TYPE_SHOW_FEEDBACK_MODAL = 'show_feedback_modal';
export const TYPE_HIDE_FEEDBACK_MODAL = 'hide_feedback_modal';
export const TYPE_SHOW_QUESTION_GAME_MODAL = 'show_question_game_modal';
export const TYPE_HIDE_QUESTION_GAME_MODAL = 'hide_question_game_modal';
export const TYPE_SHOW_GAME_INFO_MODAL = 'show_game_info_modal';
export const TYPE_HIDE_GAME_INFO_MODAL = 'hide_game_info_modal';
export const TYPE_SHOW_PERSONALITY_MODAL = 'show_personality_modal';
export const TYPE_HIDE_PERSONALITY_MODAL = 'hide_personality_modal';
export const TYPE_SHOW_PERSONALITY_INFO_MODAL = 'show_personality_info_modal';
export const TYPE_HIDE_PERSONALITY_INFO_MODAL = 'hide_personality_info_modal';

export const showPersonalityInfoModal = (data: any = {}) => ({
  type: TYPE_SHOW_PERSONALITY_INFO_MODAL,
  payload: data
});

export const hidePersonalityInfoModal = () => ({
  type: TYPE_HIDE_PERSONALITY_INFO_MODAL,
  payload: {}
});

export const showPersonalityModal = (data: any = {}) => ({
  type: TYPE_SHOW_PERSONALITY_MODAL,
  payload: data
});

export const hidePersonalityModal = () => ({
  type: TYPE_HIDE_PERSONALITY_MODAL,
  payload: {}
});

export function showGameInfoModal(data: any = {}) {
  return {
    type: TYPE_SHOW_GAME_INFO_MODAL,
    payload: data
  };
}

export function hideGameInfoModal() {
  return {
    type: TYPE_HIDE_GAME_INFO_MODAL,
    payload: {}
  };
}

export function showQuestionGameModal(data: any = {}) {
  return {
    type: TYPE_SHOW_QUESTION_GAME_MODAL,
    payload: data
  };
}

export function hideQuestionGameModal() {
  return {
    type: TYPE_HIDE_QUESTION_GAME_MODAL,
    payload: {}
  };
}

export function showFeedbackModal(data: any = {}) {
  return {
    type: TYPE_SHOW_FEEDBACK_MODAL,
    payload: data
  };
}

export function hideFeedbackModal() {
  return {
    type: TYPE_HIDE_FEEDBACK_MODAL,
    payload: {}
  };
}

export function showIcebreakerModal(data: any = {}) {
  return {
    type: TYPE_SHOW_ICEBREAKER_MODAL,
    payload: data
  };
}

export function hideIcebreakerModal() {
  return {
    type: TYPE_HIDE_ICEBREAKER_MODAL,
    payload: {}
  };
}

export function showErrorModal(data: {
  message: string
}) {
  return {
    type: TYPE_SHOW_ERROR_MODAL,
    payload: data
  };
}

export function hideErrorModal() {
  return {
    type: TYPE_HIDE_ERROR_MODAL,
    payload: {}
  };
}

export function showMatchModal(data: {
  me: {
    id: string;
    profileImage: string,
    name: string;
    gender: string;
  },
  user: {
    id: string;
    profileImage: string,
    name: string;
    gender: string;
  }
}) {
  return {
    type: TYPE_SHOW_MATCH_MODAL,
    payload: data
  };
}

export function hideMatchModal() {
  return {
    type: TYPE_HIDE_MATCH_MODAL,
    payload: {}
  };
}

export function showBrowseOptionModal(data: { [key: string]: any } = {}) {
  return {
    type: TYPE_SHOW_BROWSE_OPTION_MODAL,
    payload: data
  };
}

export function hideBrowseOptionModal() {
  return {
    type: TYPE_HIDE_BROWSE_OPTION_MODAL,
    payload: {}
  };
}

export function showDeactivateModal(data: { [key: string]: any } = {}) {
  return {
    type: TYPE_SHOW_DEACTIVATE_MODAL,
    payload: data
  };
}

export function hideDeactivateModal() {
  return {
    type: TYPE_HIDE_DEACTIVATE_MODAL,
    payload: {}
  };
}

export function showIntroModal(data: { [key: string]: any }) {
  return {
    type: TYPE_SHOW_INTRO_MODAL,
    payload: data
  };
}

export function hideIntroModal() {
  return {
    type: TYPE_HIDE_INTRO_MODAL,
    payload: {}
  };
}

export function showSearchPrefModal(data: { [key: string]: any }) {
  return {
    type: TYPE_SHOW_SEARCH_PREF_MODAL,
    payload: data
  };
}

export function hideSearchPrefModal() {
  return {
    type: TYPE_HIDE_SEARCH_PREF_MODAL,
    payload: {}
  };
}

export function showIntroMessageModal(data: { [key: string]: any }) {
  return {
    type: TYPE_SHOW_INTRO_MESSAGE_MODAL,
    payload: data
  };
}

export function hideIntroMessageModal() {
  return {
    type: TYPE_HIDE_INTRO_MESSAGE_MODAL,
    payload: {}
  };
}

export function showVerifyModal() {
  return {
    type: TYPE_SHOW_VERIFY_MODAL,
    payload: {}
  };
}

export function hideVerifyModal() {
  return {
    type: TYPE_HIDE_VERIFY_MODAL,
    payload: {}
  };
}
