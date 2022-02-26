import BadRequestError from "./errors/BadRequestError";
import InternalServerError from "./errors/InternalServerError";
import NotFoundError from "./errors/NotFoundError";
import UnauthorizedError from "./errors/UnauthorizedError";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as FileSystem from 'expo-file-system'
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Platform, NativeModules } from 'react-native';
import { Camera } from "expo-camera";
import * as Notifications from 'expo-notifications';
import { showErrorModal } from "./store/actions/modal";
import { logOutUser } from "./store/actions/auth";
// import { getExpoPushNotificationToken } from "./PushNotifications";
import { setAuthInfo } from "./services/api";
import config from "./config";
import messaging from '@react-native-firebase/messaging';

export const DEFAULT_LANG = 'bg';

export const LANGUAGE_OPTIONS: { [key: string]: string } = {
  bg: 'Bulgarian',
  en: 'English'
};

export const getLang = (lang: string | null) => {
  if (!lang) {
    lang = getDeviceLang();
  }

  return lang || DEFAULT_LANG;
}

export const getDeviceLang = () => {
  const locale = getDeviceLocale();
  if (!locale) return;

  return locale.split('_')[0];
}

const getDeviceLocale = () => {
  const deviceLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
      : NativeModules.I18nManager.localeIdentifier;

  return deviceLanguage;
}

export const randomNumberBetween = (end: number) => Math.floor(Math.random() * end);

const nf = (n: number) => n < 10 ? `0${n}` : n;

export const postedAgo = (time: number) => {
  const now = new Date();
  const d = new Date(+time);

  if (now.getFullYear() === d.getFullYear() && now.getMonth() === d.getMonth() && now.getDate() === d.getDate()) {
    return 'Today at';
  }
  const now2 = new Date();
  now2.setDate(now2.getDate() - 1);
  if (now2.getFullYear() === d.getFullYear() && now2.getMonth() === d.getMonth() && now2.getDate() === d.getDate()) {
    return 'Yesterday at';
  }

  return `${nf(now.getDate())}/${nf(now.getMonth() + 1)}` + (now.getFullYear() !== d.getFullYear() ? `/${now.getFullYear()}` : '')
};

export const throwErrorIfErrorStatusCode = (result: {
  status: number;
  json: () => any;
}) => {
  if (result.status != 200 && result.status != 201) {
    return result.json()
      .then((json: any) => {
        const message = json.error;

        if (result.status == 401 || result.status == 403) {
          throw new UnauthorizedError(message);
        } else if (result.status == 400) {
          throw new BadRequestError(message);
        } else if (result.status == 404) {
          throw new NotFoundError(message);
        } else {
          throw new InternalServerError(message);
        }
      });
  }
  //   if (result.status == 401 || result.status == 403) {
  //     throw new UnauthorizedError();
  //   } else if (result.status == 400) {
  //     throw new BadRequestError();
  //   } else if (result.status == 404) {
  //     throw new NotFoundError();
  //   } else if (result.status != 200 && result.status != 201) {
  //     throw new InternalServerError();
  //   }

  return result;
};

// export const checkFileSize = async (fileURI: string) => {
//   const fileSizeInBytes = await FileSystem.getInfoAsync(fileURI);

//   return fileSizeInBytes;
// };

export const maxNumber = (targetNumber: number, maxNumber: number) => +targetNumber > +maxNumber ? `+${maxNumber}` : targetNumber;

export const requestMediaLibraryPermissions = async () => {
  if (Platform.OS === 'web') return true;

  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
  // .then(({ status }: any) => {
  //   if (status !== 'granted') {
  //     alert('Sorry, we need camera roll permissions to make this work!');
  //   }
  // });
  return status === 'granted';
}

export const requestCameraPermissions = async () => {
  if (Platform.OS === 'web') return true;

  const { status }: any = await Camera.requestCameraPermissionsAsync();

  return status === 'granted';
}

export const requestNotificationsPermissions = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  console.log('PN->', finalStatus);

  return finalStatus === 'granted';
};

export const requestForegroundLocationPermissions = async () => {
  if (Platform.OS === 'web') return true;

  const { status }: any = await Location.requestForegroundPermissionsAsync();

  // console.log('status', status, status === 'granted');

  return status === 'granted';
}

export const getLatLng = async () => {
  // const { status } = await Location.requestForegroundPermissionsAsync();
  // if (status !== 'granted') {
  //   console.log('Permission to access location was denied');
  //   return;
  // }
  const granted = await requestForegroundLocationPermissions()
  if (!granted) {
    return null;
  }

  const location = await Location.getCurrentPositionAsync({});
  // console.log(location);

  return {
    lat: location.coords.latitude,
    lon: location.coords.longitude
  };
}

export const parseJson = (json: string) => {
  try {
    return JSON.parse(json);
  } catch (e) {
    return {};
  }
}

export const arrayToOptions = (array: any[]) => array.map(item => ({ value: item[0], label: item[1] }));

export const isVerified = (verificationStatus: string): boolean => verificationStatus === 'verified';

export const removeStorageItem = (key: string) => AsyncStorage.removeItem(key);

export const getStorageItem = (key: string) => AsyncStorage.getItem(key);

export const setStorageItem = (key: string, value: string) => AsyncStorage.setItem(key, value);

export const getImageMimeType = (uri: string) => {
  const a = uri.split('.');

  return `image/${a[a.length - 1]}`;
};

export const retryHttpRequest = (func: any, retryInMs: number = 10000) => {
  return new Promise((resolve, reject) => {
    const repeatableFunc = async () => {
      try {
        // const result: any = await func().then(throwErrorIfErrorStatusCode);
        const result: any = func();

        if (!result) return;

        resolve(await result.then(throwErrorIfErrorStatusCode));
      } catch (e) {
        // console.log(e);
        if (
          e instanceof InternalServerError
          // !(e instanceof BadRequestError) && !(e instanceof UnauthorizedError)
        ) {
          setTimeout(repeatableFunc, retryInMs);
        } else {
          reject(e as any);
        }
      }
    }

    repeatableFunc();
  });
  // return new Promise((resolve, reject) => {
  //   const repeatableFunc = async () => {
  //     try {
  //       console.log('_1');
  //       const result: any = await func().then(throwErrorIfErrorStatusCode);
  //       console.log('_1');

  //       resolve(result);
  //     } catch (e) {
  //       console.log('=========1!');
  //       if (
  //         !(e instanceof BadRequestError) && !(e instanceof UnauthorizedError)
  //       ) {
  //         setTimeout(repeatableFunc, retryInMs);
  //       } else {
  //         console.log('=========2!');
  //         console.log(e);
  //         reject(e as any);
  //       }
  //     }
  //   }

  //   repeatableFunc();
  // });
};

// retryHttpRequest(
//   () => { },
// )
//   .then((result: any) => result.json());

const map: { [key: string]: string } = {
  // ['fit', 'Fit'],
  // ['curvy', 'Curvy'],
  // ['average', 'Average'],
  // ['skinny', 'Skinny'],

  // ['regularly', 'Regularly'],
  // ['sometimes', 'Socially'],
  // ['never', 'I don\'t drink'],

  // ['regularly', 'regularly'],
  // ['sometimes', 'Sometimes'],
  // ['never', 'I don\'t smoke'],

  // ['has', 'Has children'],
  // ['does_not_have', 'Doesn\'t have children'],
  // ['does_not_have_and_does_not_want', 'Doesn\'t have children and doesn\'t want them'],
  // ['does_not_have_but_wants', 'Doesn\'t have children but want them'],

  // ['cat', 'Has cat(s)'],
  // ['dog', 'Has dog(s)'],
  // ['other', 'Has other(s) pets'],
  // ['none', 'Doesn\'t have pets'],

  // ['none', 'Doesn\'t have education'],
  // ['entry', 'Entry level'],
  // ['mid', 'High school'],
  // ['higher', 'College/University'],

  // ['full_time', 'Full-time'],
  // ['part_time', 'Part-time'],
  // ['freelance', 'Freelancer'],
  // ['self_employed', 'Self-employed'],
  // ['unemployed', 'Unemployed'],
  // ['retired', 'Retired'],

  // ['introvert', 'Introvert'],
  // ['extrovert', 'Extrovert'],
  // ['mixed', 'Somewhere in the middle'],

  // ['none', 'No income'],
  // ['low', 'Low income'],
  // ['middle', 'Average income'],
  // ['high', 'Hight income'],

  // ['male', 'Male'],
  // ['female', 'Female'],

  fit: 'Fit',
  curvy: 'Curvy',
  average: 'Average',
  skinny: 'Skinny',

  regularly: 'Regularly',
  sometimes_drinking: 'Socially',
  never_drinking: "I don't drink",

  sometimes_smoking: 'Sometimes',
  never_smoking: "I don't smoke",

  has: 'Has children',
  does_not_have: "Doesn't have children",
  does_not_have_and_does_not_want: "Doesn't have children and doesn't want them",
  does_not_have_but_wants: "Doesn't have children but want them",

  cat: 'Has cat(s)',
  dog: 'Has dog(s)',
  other: 'Has other(s) pets',
  none_pets: "Doesn't have pets",

  none_education: "Doesn't have education",
  entry: 'Entry level',
  mid: 'High school',
  higher: 'College/University',

  full_time: 'Full-time',
  part_time: 'Part-time',
  freelance: 'Freelancer',
  self_employed: 'Self-employed',
  unemployed: 'Unemployed',
  retired: 'Retired',

  introvert: 'Introvert',
  extrovert: 'Extrovert',
  mixed: 'Somewhere in the middle',

  none_income: 'No income',
  low: 'Low income',
  middle: 'Average income',
  high: 'High income',

  male: 'Male',
  female: 'Female',

  males: 'Males',
  females: 'Females'

  // ['fit', 'Fit'],
  // ['curvy', 'Curvy'],
  // ['average', 'Average'],
  // ['skinny', 'Skinny'],

  // ['regularly', 'Regularly'],
  // ['sometimes_drinking', 'Socially'],
  // ['never_drinking', 'I don\'t drink'],

  // ['regularly', 'Regularly'],
  // ['sometimes_smoking', 'Sometimes'],
  // ['never_smoking', 'I don\'t smoke'],

  // ['has', 'Has children'],
  // ['does_not_have', 'Doesn\'t have children'],
  // ['does_not_have_and_does_not_want', 'Doesn\'t have children and doesn\'t want them'],
  // ['does_not_have_but_wants', 'Doesn\'t have children but want them'],

  // ['cat', 'Has cat(s)'],
  // ['dog', 'Has dog(s)'],
  // ['other', 'Has other(s) pets'],
  // ['none_pets', 'Doesn\'t have pets'],

  // ['none_education', 'Doesn\'t have education'],
  // ['entry', 'Entry level'],
  // ['mid', 'High school'],
  // ['higher', 'College/University'],

  // ['full_time', 'Full-time'],
  // ['part_time', 'Part-time'],
  // ['freelance', 'Freelancer'],
  // ['self_employed', 'Self-employed'],
  // ['unemployed', 'Unemployed'],
  // ['retired', 'Retired'],

  // ['introvert', 'Introvert'],
  // ['extrovert', 'Extrovert'],
  // ['mixed', 'Somewhere in the middle'],

  // ['none_income', 'No income'],
  // ['low', 'Low income'],
  // ['middle', 'Average income'],
  // ['high', 'Hight income'],

  // ['male', 'Male'],
  // ['female', 'Female'],
};

const defaultKey = 'I rather not say';

export const getOptionItem = (key: string) => map[key] || defaultKey;

export const getInterestedInOption = (key: string) => getOptionItem(`${key}s`);

/**
 * income, education, pets
 * @param key 
 * @returns 
 */
export const getOptionWithNoneItem = (key: string, prop: string) => getOptionItem(key === 'none' ? `none_${prop}` : key);
export const getSmokingOrDrinkingOptionItem = (key: string, prop: string) => {
  if (key === 'none') return getOptionItem(`none_${prop}`);
  if (key === 'never') return getOptionItem(`never_${prop}`);
  if (key === 'sometimes') return getOptionItem(`sometimes_${prop}`);

  return getOptionItem(key);
}

export const getErrorMessage = (message: string) => {
  if (typeof message !== 'string' || '' === message.trim()) return 'Internal server error.';

  return message;
};

export const handleError = (err: any, dispatch: (data?: any) => void) => {
  if (err instanceof UnauthorizedError) {
    dispatch(logOutUser());

    return;
  }

  dispatch(showErrorModal({ message: getErrorMessage(err.message) }));
}

export const getExpoPushNotificationToken: () => Promise<string | null> = async () => {
  return await messaging().getToken();
  // const granted = await requestNotificationsPermissions();
  // console.log('granted', granted);
  // if (!granted) {
  //   return null;
  // }
  // console.log('-1-');

  // // const token = await Notifications.getExpoPushTokenAsync();
  // const token = await Notifications.getExpoPushTokenAsync({ experienceId: config.EXPERIENCE_ID });
  // // ExponentPushToken[AfNbOAM4nMRTLvfLabmDiq]
  // // ExponentPushToken[AfNbOAM4nMRTLvfLabmDiq]
  // console.log('-2-');
  // console.log('TOKEN:', token);

  // return token?.data;
}

export const updateLocationAndPushToken = (token: string, isMounted: any) => {
  return Promise.all([
    getLatLng()
      .then(location => ({
        lat: location?.lat,
        lon: location?.lon,
      }))
      .catch(() => ({ lat: undefined, lon: undefined })),
    getExpoPushNotificationToken()
      .catch(() => null)
  ])
    .then(([{ lat, lon }, pushToken]) => {
      if (!lat && !lon && !pushToken) return;

      return retryHttpRequest(() => {
        if (!isMounted?.current) return;

        return setAuthInfo({ lat, lon, pushToken }, token);
      }).catch(() => { });
    });
}
