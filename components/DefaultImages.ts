import { Image } from "react-native";

export const DEFAULT_MAN_IMAGE = Image.resolveAssetSource(require('../assets/man.jpg'));
export const DEFAULT_FEMALE_IMAGE = Image.resolveAssetSource(require('../assets/female.jpg'));
export const VERIFY_MALE_IMAGE = Image.resolveAssetSource(require('../assets/verify_male.jpeg'));
export const VERIFY_FEMALE_IMAGE = Image.resolveAssetSource(require('../assets/verify_female.jpeg'));

export const getDefaultImage = (gender: string) => {
  if (gender === 'female') return DEFAULT_FEMALE_IMAGE;

  return DEFAULT_MAN_IMAGE;
};

export const getVerifyImage = (gender: string) => {
  if (gender === 'female') return VERIFY_FEMALE_IMAGE;

  return VERIFY_MALE_IMAGE;
};
