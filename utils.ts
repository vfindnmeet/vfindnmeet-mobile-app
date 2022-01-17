import BadRequestError from "./errors/BadRequestError";
import InternalServerError from "./errors/InternalServerError";
import NotFoundError from "./errors/NotFoundError";
import UnauthorizedError from "./errors/UnauthorizedError";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as FileSystem from 'expo-file-system'
import * as Location from 'expo-location';

export const DEFAULT_LANG = 'bg';

export const throwErrorIfErrorStatusCode = (result: {
  status: number;
  json: () => any;
}) => {
  if (result.status == 401 || result.status == 403) {
    throw new UnauthorizedError();
  } else if (result.status == 400) {
    throw new BadRequestError();
  } else if (result.status == 404) {
    throw new NotFoundError();
  } else if (result.status != 200 && result.status != 201) {
    throw new InternalServerError();
  }

  return result;
};

// export const checkFileSize = async (fileURI: string) => {
//   const fileSizeInBytes = await FileSystem.getInfoAsync(fileURI);

//   return fileSizeInBytes;
// };

export const maxNumber = (targetNumber: number, maxNumber: number) => +targetNumber > +maxNumber ? `+${maxNumber}` : targetNumber;

export const getLatLng = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.log('Permission to access location was denied');
    return;
  }

  const location = await Location.getCurrentPositionAsync({});
  console.log(location);

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
        const result: any = await func().then(throwErrorIfErrorStatusCode);

        resolve(result);
      } catch (e) {
        if (
          !(e instanceof BadRequestError) && !(e instanceof UnauthorizedError)
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
  female: 'Female'

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

/**
 * income, education, pets
 * @param key 
 * @returns 
 */
export const getOptionWithNoneItem = (key: string, prop: string) => getOptionItem(key === 'none' ? `none_${prop}` : key);
export const getSmokingOrDrinkingOptionItem = (key: string, prop: string) => {
  if (key === 'none') return getOptionItem(`none_${prop}`);
  if (key === 'never') return getOptionItem(`never_${prop}`);

  return getOptionItem(key);
}
