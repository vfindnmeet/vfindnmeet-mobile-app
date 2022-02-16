import React, { useEffect, useContext, useState } from 'react';
import { Image, View, Platform, TouchableWithoutFeedback } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActivityIndicator, Colors, IconButton, TouchableRipple } from 'react-native-paper';
import { getTokenSelector } from '../store/selectors/auth';
import { useDispatch, useSelector } from 'react-redux';
import InternalServerError from '../errors/InternalServerError';
import BadRequestError from '../errors/BadRequestError';
import { deleteUserImage, pickImageFromLilbrary, uploadUserImage } from '../utils/media';
import { useIsMounted } from '../hooks/useIsMounted';
import UnauthorizedError from '../errors/UnauthorizedError';
import { showErrorModal } from '../store/actions/modal';
import { GALELRY_ADD_ICON_SIZE, ICON_SIZE } from '../constants';
// import { requestMediaLibraryPermissions } from '../utils';

export default function SingleImagePicker(props: any) {
  const { image, setImages, allowImageChaning } = props;
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const token = useSelector(getTokenSelector);

  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  // useEffect(() => {
  //   requestMediaLibraryPermissions();
  //   // (async () => {
  //   //   if (Platform.OS !== 'web') {
  //   //     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   //     if (status !== 'granted') {
  //   //       alert('Sorry, we need camera roll permissions to make this work!');
  //   //     } else {
  //   //       // console.log('GRANTED!!');
  //   //     }
  //   //   }
  //   // })();
  // }, []);

  const onOpenImagePicker = async (imageId?: string) => {
    if (!allowImageChaning || loadingImage) {
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

      setLoadingImage(true);
      const userImages: { uri: string }[] = await uploadUserImage({
        uri: result.uri,
        name: 'image',
        type: result.type,
        width: result.width,
        height: result.height
      }, token, imageId);

      if (!isMounted.current) return;

      // console.log('IMGA:', userImages);
      // setLoadingImage(false);
      setImages(userImages);
    } catch (e) {
      console.log('ERR:', e);
      if (e instanceof InternalServerError || e instanceof BadRequestError) {
        dispatch(showErrorModal({ message: 'Error uploading image.' }));
      } else {
        dispatch(showErrorModal({ message: 'Error opening images.' }));
      }
    } finally {
      if (!isMounted.current) return;

      setLoadingImage(false);
    }
  };

  const onRemoveImage = async (image: any) => {
    if (!allowImageChaning || loadingImage) {
      return;
    }

    setLoadingImage(true);

    try {
      const images = await deleteUserImage(image.imageId, token);

      if (!isMounted.current) return;

      setLoadingImage(false);
      setImages(images);
    } catch (e) {
      if (e instanceof UnauthorizedError) {

      } else {
        dispatch(showErrorModal({ message: 'Internal server error.' }))
      }
    }
  };

  // const listImages = [];
  // for (let i = 0; i < images.length; i++) {
  //   listImages.push({ ...images[i] });
  // }
  // if (images.length < 6) {
  //   listImages.push(null);
  // }

  return (
    <View style={{
      width: '100%',
      // padding: 2,
    }}>
      <TouchableWithoutFeedback
        onPress={() => onOpenImagePicker(image?.imageId)}
      // rippleColor="rgba(0, 0, 0, .32)"
      >
        <View style={{
          borderWidth: 1,
          borderRadius: 2,
          borderColor: Colors.black
        }}>
          {image ? (
            loadingImage ? (
              <View style={{
                width: '100%',
                aspectRatio: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <ActivityIndicator />
              </View>
            ) : (
              <View>
                <Image source={{ uri: image.uri_big }} style={{
                  width: '100%',
                  aspectRatio: 1,
                }} />
                <IconButton
                  icon="close"
                  size={ICON_SIZE}
                  color={Colors.redA700}
                  onPress={() => onRemoveImage(image)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: '#000',
                    opacity: 0.7,
                    borderRadius: 100,
                    borderWidth: 1,
                  }}
                />
              </View>
            )
          ) : (
            loadingImage ? (
              <View style={{
                width: '100%',
                aspectRatio: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <ActivityIndicator />
              </View>
            ) : (
              <View style={{
                width: '100%',
                aspectRatio: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <MaterialCommunityIcons name="plus-circle" size={GALELRY_ADD_ICON_SIZE} />
              </View>
            )
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
