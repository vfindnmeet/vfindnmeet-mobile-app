export const TYPE_FETCH_PROFILE = 'fetch_profile';
export const TYPE_SET_PROFILE = 'set_profile';
export const TYPE_CLEAR_PROFILE = 'clear_profile';
export const TYPE_DELETE_IMAGE = 'delete_image';
export const TYPE_SET_DESCRIPTION = 'set_description';
export const TYPE_SET_PROFILE_INFO = 'set_profile_info';

export function fetchProfile() {
  return {
    type: TYPE_FETCH_PROFILE,
    payload: {}
  };
}

export function setProfile(profile: any) {
  return {
    type: TYPE_SET_PROFILE,
    payload: { profile }
  };
}

export function clearProfile() {
  return {
    type: TYPE_CLEAR_PROFILE,
    payload: {}
  };
}

export function deleteImage(imageId: string) {
  return {
    type: TYPE_DELETE_IMAGE,
    payload: { imageId }
  };
}

export function setProfileDescription(description: string) {
  return {
    type: TYPE_SET_DESCRIPTION,
    payload: { description }
  };
}

export function setProfileInfo(info: {[key: string]: any}) {
  return {
    type: TYPE_SET_PROFILE_INFO,
    payload: info
  };
}
