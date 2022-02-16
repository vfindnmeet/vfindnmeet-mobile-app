import React, { useEffect, useContext, useState } from 'react';
import { Image, View, Platform, TouchableWithoutFeedback } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import { uploadImage as uploadImageReq } from '../services/api';
import { getTokenSelector } from '../store/selectors/auth';
import { useDispatch, useSelector } from 'react-redux';
import { requestMediaLibraryPermissions, throwErrorIfErrorStatusCode } from '../utils';
import { pickImageFromLilbrary } from '../utils/media';
import InternalServerError from '../errors/InternalServerError';
import BadRequestError from '../errors/BadRequestError';
import { showErrorModal } from '../store/actions/modal';
import { useIsMounted } from '../hooks/useIsMounted';

const uploadImage = async (
  fileToUpload: {
    uri: string;
    name: string;
    type: string;
    width?: number;
    height?: number;
  },
  token: string | null
) => {
  const res = await uploadImageReq(fileToUpload, token as string).then(throwErrorIfErrorStatusCode);

  return await res.json();
};

export default function ImagePicker(props: any) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  const { onUpload, onStartUpload, shouldUpload, children } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const token = useSelector(getTokenSelector);

  useEffect(() => {
    requestMediaLibraryPermissions();
    // (async () => {
    //   if (Platform.OS !== 'web') {
    //     const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    //     if (status !== 'granted') {
    //       alert('Sorry, we need camera roll permissions to make this work!');
    //     } else {
    //       // console.log('GRANTED!!');
    //     }
    //   }
    // })();
  }, []);

  const onOpenImagePicker = async () => {
    if (loading) {
      return;
    }

    if (shouldUpload && !shouldUpload()) {
      return;
    }

    try {
      const result: any = await pickImageFromLilbrary();

      if (!result) return;
      // if (result.width <= 600 || result.height <= 600) {
      //   dispatch(showErrorModal({ message: 'Image must be a size of at least 600x600.' }));

      //   return;
      // }
      if (result.width <= 400 || result.height <= 400) {
        dispatch(showErrorModal({ message: 'Image must be a size of at least 400x400.' }));

        return;
      }

      onStartUpload && onStartUpload();
      setLoading(true);
      const image: { imageId: string; uri_big: string; uri_small: string } = await uploadImage({
        uri: result.uri,
        name: 'image',
        type: result.type,
        width: result.width,
        height: result.height
      }, token);

      if (!isMounted.current) return;

      // console.log('IMGA:', image);
      // setImages(image);
      onUpload(image);
      // setLoading(false);
    } catch (e) {
      if (e instanceof InternalServerError || e instanceof BadRequestError) {
        dispatch(showErrorModal({ message: 'Error uploading image.' }));
      } else {
        dispatch(showErrorModal({ message: 'Error opening images.' }));
      }
      // console.log(e);
    } finally {
      if (!isMounted.current) return;

      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => onOpenImagePicker()}
    >
      {children}
    </TouchableWithoutFeedback>
  );
}
