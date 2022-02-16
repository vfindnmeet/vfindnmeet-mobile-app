
import * as ImagePicker from 'expo-image-picker';
import { deleteUserImage as deleteUserImageReq, uploadUserImage as uploadUserImageReq } from '../services/api';
import { throwErrorIfErrorStatusCode } from '../utils';

export const pickImageFromLilbrary = async () => {
  const result: any = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    // allowsEditing: true,
    // aspect: [4, 3],
    quality: 1,
  });

  if (result.cancelled) {
    return null;
  }

  const uri = result.uri;
  const a = uri.split('.');

  return {
    ...result,
    type: `image/${a[a.length - 1]}`
  };
}

export const uploadUserImage = async (
  fileToUpload: {
    uri: string;
    name: string;
    type: string;
    width?: number;
    height?: number;
  },
  token: string | null,
  replaceImageId?: string
) => {
  const res = await uploadUserImageReq(fileToUpload, replaceImageId, token as string).then(throwErrorIfErrorStatusCode);

  return (await res.json()).images;
};

export const deleteUserImage = async (imageId: string, token: string | null) => {
  const res: any = await deleteUserImageReq(imageId, token as string).then(throwErrorIfErrorStatusCode);

  const responseJson = await res.json();

  return responseJson.images;
};
