import { TYPE_HIDE_BROWSE_OPTION_MODAL, TYPE_HIDE_DEACTIVATE_MODAL, TYPE_HIDE_INTRO_MESSAGE_MODAL, TYPE_HIDE_INTRO_MODAL, TYPE_HIDE_MATCH_MODAL, TYPE_HIDE_SEARCH_PREF_MODAL, TYPE_HIDE_VERIFY_MODAL, TYPE_SHOW_BROWSE_OPTION_MODAL, TYPE_SHOW_DEACTIVATE_MODAL, TYPE_SHOW_INTRO_MESSAGE_MODAL, TYPE_SHOW_INTRO_MODAL, TYPE_SHOW_MATCH_MODAL, TYPE_SHOW_SEARCH_PREF_MODAL, TYPE_SHOW_VERIFY_MODAL } from "../actions/modal";

const INITIAL_STATE: any = {};

export default function modalReducer(state = INITIAL_STATE, action: { type: string, payload: any }) {
  switch (action.type) {
    case TYPE_SHOW_VERIFY_MODAL:
      return {
        showVerifyModal: true,
        ...action.payload
      };
    case TYPE_HIDE_VERIFY_MODAL:
      return {
        showVerifyModal: false
      };
    case TYPE_SHOW_MATCH_MODAL:
      return {
        showMatchModal: true,
        ...action.payload
      };
    case TYPE_HIDE_MATCH_MODAL:
      return {
        showMatchModal: false
      };
    case TYPE_SHOW_BROWSE_OPTION_MODAL:
      return {
        showBrowseOptionModal: true,
        ...action.payload
      };
    case TYPE_HIDE_BROWSE_OPTION_MODAL:
      return {
        showBrowseOptionModal: false
      };
    case TYPE_SHOW_DEACTIVATE_MODAL:
      return {
        showDeactivateModal: true,
        ...action.payload
      };
    case TYPE_HIDE_DEACTIVATE_MODAL:
      return {
        showDeactivateModal: false
      };
    case TYPE_SHOW_INTRO_MODAL:
      return {
        showIntroModal: true,
        ...action.payload
      };
    case TYPE_HIDE_INTRO_MODAL:
      return {
        showIntroModal: false
      };
    case TYPE_SHOW_SEARCH_PREF_MODAL:
      return {
        showSearchPrefModal: true,
        ...action.payload
      };
    case TYPE_HIDE_SEARCH_PREF_MODAL:
      return {
        showSearchPrefModal: false
      };
    case TYPE_SHOW_INTRO_MESSAGE_MODAL:
      return {
        showIntroMessageModal: true,
        ...action.payload
      };
    case TYPE_HIDE_INTRO_MESSAGE_MODAL:
      return {
        showIntroMessageModal: false
      };
  }

  return state;
}
