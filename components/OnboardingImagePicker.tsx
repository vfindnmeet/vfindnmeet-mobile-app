import React, { useEffect, useContext, useState } from 'react';
import { Image, View, Platform, TouchableWithoutFeedback } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActivityIndicator, Colors, IconButton, TouchableRipple } from 'react-native-paper';
import { getTokenSelector } from '../store/selectors/auth';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUserImage, pickImageFromLilbrary, uploadUserImage } from '../utils/media';
import InternalServerError from '../errors/InternalServerError';
import BadRequestError from '../errors/BadRequestError';
import { useIsMounted } from '../hooks/useIsMounted';
import { showErrorModal } from '../store/actions/modal';
import UnauthorizedError from '../errors/UnauthorizedError';
import { requestMediaLibraryPermissions } from '../utils';
import { GALELRY_ADD_ICON_SIZE, ICON_SIZE } from '../constants';

export default function OnboardingImagePicker(props: any) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  const token = useSelector(getTokenSelector);

  const { images, setImages, setError, allowImageChaning } = props;
  const [loadingImages, setLoadingImages] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    requestMediaLibraryPermissions();
    //   if (Platform.OS === 'web') return;
    // ImagePicker.requestMediaLibraryPermissionsAsync()
    //   .then(({ status }: any) => {
    //     if (status !== 'granted') {
    //       alert('Sorry, we need camera roll permissions to make this work!');
    //     }
    //   });
  }, []);

  const setImageLoading = (loading: boolean, imageId?: string) => {
    setLoadingImages({
      ...loadingImages,
      [imageId ?? -1]: loading
    });
  };

  const onOpenImagePicker = async (imageId?: string) => {
    if (!allowImageChaning || loadingImages[imageId ?? -1]) {
      return;
    }

    try {
      const result: any = await pickImageFromLilbrary();

      if (!result) return;
      // if (result.width <= 600 || result.height <= 600) {
      //   setError('Image must be a size of at least 600x600.');

      //   return;
      // }
      if (result.width <= 400 || result.height <= 400) {
        dispatch(showErrorModal({ message: 'Image must be a size of at least 400x400.' }));

        return;
      }

      setImageLoading(true, imageId);
      const userImages: { uri: string }[] = await uploadUserImage({
        uri: result.uri,
        name: 'image',
        type: result.type,
        width: result.width,
        height: result.height
      }, token, imageId);

      if (!isMounted.current) return;

      setImages(userImages);
      // setImageLoading(false, imageId);
    } catch (e) {
      if (e instanceof InternalServerError || e instanceof BadRequestError) {
        setError('Error uploading image.')
      } else {
        setError('Error opening images.')
      }
    } finally {
      if (!isMounted.current) return;

      setImageLoading(false, imageId);
    }
  };

  const onRemoveImage = async (image: any, ix: number) => {
    if (!allowImageChaning || loadingImages[image.imageId]) {
      return;
    }

    setImageLoading(true, image.imageId);

    try {
      const images = await deleteUserImage(image.imageId, token);

      if (!isMounted.current) return;

      setImages(images);
      setImageLoading(false, image.imageId);
    } catch (e) {
      if (e instanceof UnauthorizedError) {

      } else {
        dispatch(showErrorModal({ message: 'Internal server error.' }))
      }
    }
  };

  const listImages = [];
  for (let i = 0; i < images.length; i++) {
    listImages.push({ ...images[i] });
  }
  if (images.length < 6) {
    listImages.push(null);
  }

  return (
    <View>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
      }}>
        {listImages.map((image, ix) => (
          <View key={ix} style={{
            width: '50%',
            padding: 2,
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
                  loadingImages[image.imageId] ? (
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
                      <Image key={ix} source={{ uri: image.uri_big }} style={{
                        width: '100%',
                        aspectRatio: 1,
                      }} />
                      <IconButton
                        icon="close"
                        size={ICON_SIZE}
                        color={Colors.redA700}
                        onPress={() => onRemoveImage(image, ix)}
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
                  loadingImages[-1] ? (
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
        ))}
      </View>
    </View>
  );
}
