import config from '../config';

const addAuthHeader = (token: string, headers: any = {}) => ({
  ...headers,
  'x-auth-token': token
});

const queryParams = (params: any) => {
  const query = Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
    .map(key => `${key}=${params[key]}`)
    .join('&');

  return query ? `?${query}` : '';
}

export const getNearbyUsers = async (token: string, onlineOnly: boolean, lastTimestamp?: number) => {
  return fetch(config.API_ENDPOINT + 'users' + queryParams({ oo: onlineOnly, lts: lastTimestamp }), {
    method: 'GET',
    headers: addAuthHeader(token, {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }),
  });
};

export const getChats = async (token: string) => {
  return fetch(config.API_ENDPOINT + 'chats', {
    method: 'GET',
    headers: addAuthHeader(token, {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }),
  });
};

// export const sendChatMessage = async (userId: string, {
//   // userId,
//   chatId,
//   isNew,
//   text,
//   imageId
// }: {
//   // userId: string;
//   chatId: string;
//   text?: string;
//   imageId?: string;
//   isNew: boolean;
// }, token: string) => {
export const sendChatMessage = async (userId: string, message: any, token: string) => {
  return fetch(config.API_ENDPOINT + `chat/${userId}/new-message`, {
    method: 'POST',
    headers: addAuthHeader(token, {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      ...message,
      userId,
    })
  });
};

export const getChat = async (userId: string, token: string) => {
  return fetch(config.API_ENDPOINT + `chat/${userId}`, {
    method: 'GET',
    headers: addAuthHeader(token, {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }),
  });
};

export const getOlderMessages = async (userId: string, ts: number, token: string) => {
  return fetch(config.API_ENDPOINT + `chat/${userId}/older` + queryParams({ t: ts }), {
    method: 'GET',
    headers: addAuthHeader(token, {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    })
  });
};

// export const sendChatMessage = async (userId: string, token: string) => {
//   return fetch(config.API_ENDPOINT + `chat/${userId}`, {
//     method: 'GET',
//     headers: addAuthHeader(token, {
//       Accept: 'application/json',
//       'Content-Type': 'application/json'
//     }),
//   });
// };

export const getMessagesAfterTs = async (userId: string, after: number, token: string) => {
  return fetch(config.API_ENDPOINT + `chat/${userId}/messages-after` + queryParams({ after }), {
    method: 'GET',
    headers: addAuthHeader(token, {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }),
  });
};

export const getNotSeenMessagesPerChat = async (token: string) => {
  return fetch(config.API_ENDPOINT + `not-seen-messages-per-chat`, {
    method: 'GET',
    headers: addAuthHeader(token, {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }),
  });
};

export const getMatchedUsers = async (token: string) => {
  return fetch(config.API_ENDPOINT + 'matches', {
    method: 'GET',
    headers: addAuthHeader(token, {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }),
  });
};

export const getOnboardingStep = async (token: string) => {
  return fetch(config.API_ENDPOINT + 'onboarding/step', {
    method: 'GET',
    headers: addAuthHeader(token, {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }),
  });
};

export const deleteUserImage = async (targetImageId: string, token: string) => {
  return fetch(config.API_ENDPOINT + 'users/image' + queryParams({ targetImageId }), {
    method: 'DELETE',
    headers: addAuthHeader(token)
  });
}

export const deleteImage = async (targetImageId: string, token: string) => {
  return fetch(config.API_ENDPOINT + 'image' + queryParams({ targetImageId }), {
    method: 'DELETE',
    headers: addAuthHeader(token)
  });
}

export const getOnboardingImages = async (token: string) => {
  return fetch(config.API_ENDPOINT + 'onboarding/images', {
    method: 'GET',
    headers: addAuthHeader(token)
  });
}

export const getOnboardingData = async (data: any, token: string) => {
  return fetch(config.API_ENDPOINT + 'onboarding/data', {
    method: 'POST',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(data)
  });
}

export const completeOnboarding = async (token: string) => {
  return fetch(config.API_ENDPOINT + 'onboarding/complete', {
    method: 'POST',
    headers: addAuthHeader(token)
  });
}

export const login = async ({
  email,
  password,
  lat,
  lon,
  pushToken
}: {
  email: string;
  password: string;
  lat?: number;
  lon?: number;
  pushToken?: string | null;
}) => {
  return fetch(config.API_ENDPOINT + 'login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password, lat, lon, pushToken })
  });
}

export const setAuthInfo = async ({
  lat,
  lon,
  pushToken
}: {
  lat?: number;
  lon?: number;
  pushToken?: string | null;
}, token: string) => {
  return fetch(config.API_ENDPOINT + 'auth-info', {
    method: 'POST',
    headers: addAuthHeader(token, {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({ lat, lon, pushToken })
  });
}

export const signUp = async (email: string, password: string) => {
  return fetch(config.API_ENDPOINT + 'sign-up', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
}

export const logout = async (token: string) => {
  return fetch(config.API_ENDPOINT + 'logout', {
    method: 'POST',
    headers: addAuthHeader(token)
  });
}

export const uploadUserImage = async (
  file: {
    uri: string;
    name: string;
    type: string;
    width?: number;
    height?: number;
  },
  replaceImageId: string | undefined,
  token: string
) => {
  const formData = new FormData();
  formData.append('image', file as any);

  return fetch(config.API_ENDPOINT + 'users/image/upload' + queryParams({
    replaceImageId,
    width: file.width,
    height: file.height
  }), {
    method: 'POST',
    body: formData,
    headers: addAuthHeader(token, {
      'Content-Type': 'multipart/form-data',
    }),
  });
}

export const uploadImage = async (
  file: {
    uri: string;
    name: string;
    type: string;
    width?: number;
    height?: number;
  },
  token: string
) => {
  const formData = new FormData();
  formData.append('image', file as any);

  return fetch(config.API_ENDPOINT + 'image/upload' + queryParams({
    width: file.width,
    height: file.height
  }), {
    method: 'POST',
    body: formData,
    headers: addAuthHeader(token, {
      'Content-Type': 'multipart/form-data',
    }),
  });
}

export const uploadImageForVerification = async (
  file: {
    uri: string;
    name: string;
    type: string;
    width?: number;
    height?: number;
  },
  // replaceImageId: string | undefined,
  token: string
) => {
  const formData = new FormData();
  formData.append('image', file as any);

  console.log('sending...', file);

  return fetch(config.API_ENDPOINT + 'verification/upload' + queryParams({
    // replaceImageId,
    width: file.width,
    height: file.height
  }), {
    method: 'POST',
    body: formData,
    headers: addAuthHeader(token, {
      'Content-Type': 'multipart/form-data',
    }),
  });
}

export const getProfile = async (token: string) => {
  return fetch(config.API_ENDPOINT + 'user-profile', {
    method: 'GET',
    headers: addAuthHeader(token, {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }),
  });
};

export const getProfileInfo = async (token: string) => {
  return fetch(config.API_ENDPOINT + 'user-profile-info', {
    method: 'GET',
    headers: addAuthHeader(token, {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }),
  });
};

export const getUserProfile = async (userId: string, token: string) => {
  return fetch(config.API_ENDPOINT + 'user/' + userId, {
    method: 'GET',
    headers: addAuthHeader(token, {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }),
  });
};

export const updateProfile = async (data: any, token: string) => {
  return fetch(config.API_ENDPOINT + 'user-profile', {
    method: 'POST',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(data)
  });
}

export const updateProfileInfo = async (data: any, token: string) => {
  return fetch(config.API_ENDPOINT + 'user-info', {
    method: 'POST',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(data)
  });
}

export const setInterests = async (interestIds: string[], token: string) => {
  return fetch(config.API_ENDPOINT + 'interests', {
    method: 'POST',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({ interestIds })
  });
}

export const getInterests = async (token: string) => {
  return fetch(config.API_ENDPOINT + 'interests', {
    method: 'GET',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    })
  });
}

export const getProfileQuestions = async (token: string) => {
  return fetch(config.API_ENDPOINT + 'profile-questions', {
    method: 'GET',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    })
  });
}

export const addProfileQuestions = async (
  { questionId, answerId, answer }: { questionId: string, answerId: string | undefined, answer: string },
  token: string
) => {
  return fetch(config.API_ENDPOINT + 'users/profile-answer', {
    method: 'POST',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({ questionId, answerId, answer })
  });
}

export const deleteProfileQuestions = async (answerId: string, token: string) => {
  return fetch(config.API_ENDPOINT + 'users/profile-answer', {
    method: 'DELETE',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({ answerId })
  });
}

export const setProfileImage = async (imageId: string, token: string) => {
  return fetch(config.API_ENDPOINT + 'users/profile-img', {
    method: 'POST',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({ imageId })
  });
}

export const likeUser = async (userId: string, token: string) => {
  return fetch(config.API_ENDPOINT + `users/${userId}/like`, {
    method: 'POST',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    })
  });
}

export const passUser = async (userId: string, token: string) => {
  return fetch(config.API_ENDPOINT + `users/${userId}/pass`, {
    method: 'POST',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    })
  });
}

export const unlikeUser = async (userId: string, token: string) => {
  return fetch(config.API_ENDPOINT + `users/${userId}/unlike`, {
    method: 'POST',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    })
  });
}

export const unmatchUser = async (userId: string, token: string) => {
  return fetch(config.API_ENDPOINT + `users/${userId}/unmatch`, {
    method: 'POST',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    })
  });
}

export const updateLikeMessage = async (likeId: string, message: string, token: string) => {
  return fetch(config.API_ENDPOINT + `like/${likeId}/update`, {
    method: 'POST',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({ message })
  });
}

export const getLikesFrom = async (page: number, token: string) => {
  return fetch(config.API_ENDPOINT + `likes-from?page=${page}`, {
    method: 'GET',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    })
  });
}

export const getLikesTo = async (page: number, token: string) => {
  return fetch(config.API_ENDPOINT + `likes-to?page=${page}`, {
    method: 'GET',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    })
  });
}

export const getSearchPreferences = async (token: string) => {
  return fetch(config.API_ENDPOINT + 'search-preferences', {
    method: 'GET',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    })
  });
}

export const updateSearchPreferences = async (searchPreferences: { [key: string]: any }, token: string) => {
  return fetch(config.API_ENDPOINT + 'search-preferences', {
    method: 'POST',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(searchPreferences)
  });
}

export const getRecommendations = async (token: string) => {
  return fetch(config.API_ENDPOINT + 'recommendations', {
    method: 'GET',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    })
  });
}

export const updatePosition = async (lat: number, lon: number, token: string) => {
  // console.log('SEND POSITION');
  return fetch(config.API_ENDPOINT + 'update-position', {
    method: 'POST',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({ lat, lon })
  });
}

export const deactivate = async (password: string, token: string) => {
  return fetch(config.API_ENDPOINT + 'settings/deactivate', {
    method: 'POST',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({ password })
  });
}

export const getSettingsInfo = async (token: string) => {
  return fetch(config.API_ENDPOINT + 'info-settings', {
    method: 'GET',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    })
  });
}

export const registerPushNotificationToken = async (pushToken: string, token: string) => {
  return fetch(config.API_ENDPOINT + 'register-pn-token', {
    method: 'POST',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({ token: pushToken })
  });
}

export const getWouldYouRatherQuestions = async () => {
  return fetch(config.API_ENDPOINT + 'would-you-rather-questions', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getQuestionGameQuestions = async () => {
  return fetch(config.API_ENDPOINT + 'question-game-questions', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const reportMedia = async (messageId: string, token: string) => {
  return fetch(config.API_ENDPOINT + 'report-media', {
    method: 'POST',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({ messageId })
  });
}

export const addFeedback = async (type: string, details: string, token: string) => {
  return fetch(config.API_ENDPOINT + 'add-feedback', {
    method: 'POST',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({ type, details })
  });
}

export const getPersonalityQuestions = async () => {
  return fetch(config.API_ENDPOINT + 'personality-questions', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const calculatePersonality = async (answers: { [key: number]: number; }, token: string) => {
  console.log(JSON.stringify({ answers }));

  return fetch(config.API_ENDPOINT + 'personality-calculate', {
    method: 'POST',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({ answers })
  });
}

export const getPersonality = async (token: string) => {
  return fetch(config.API_ENDPOINT + 'personality', {
    method: 'GET',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    }),
  });
}

export const setPersonality = async (personality: string, token: string) => {
  return fetch(config.API_ENDPOINT + 'personality', {
    method: 'POST',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({ personality })
  });
}

export const setPushNotifSettings = async (data: {
  messages?: boolean;
  likes?: boolean;
  matches?: boolean;
  videoCalls?: boolean;
}, token: string) => {
  return fetch(config.API_ENDPOINT + 'push-notif-settings', {
    method: 'POST',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(data)
  });
}

export const videoCall = async (data: {
  calledId: string;
  width: number;
  height: number;
}, token: string) => {
  return fetch(config.API_ENDPOINT + 'video-call', {
    method: 'POST',
    headers: addAuthHeader(token, {
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(data)
  });
}
