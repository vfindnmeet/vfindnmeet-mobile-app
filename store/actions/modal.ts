export const TYPE_SHOW_VERIFY_MODAL = 'show_verify_modal';
export const TYPE_HIDE_VERIFY_MODAL = 'hide_verify_modal';
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
