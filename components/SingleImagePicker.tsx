import React, { useEffect, useContext, useState } from 'react';
import { Image, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActivityIndicator, Colors, IconButton, TouchableRipple } from 'react-native-paper';
import { deleteFile, uploadFile } from '../services/api';
import { getTokenSelector } from '../store/selectors/auth';
import { useSelector } from 'react-redux';

const uploadImage = async (
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
  const res = await uploadFile(fileToUpload, replaceImageId, token as string);

  const responseJson = await res.json();

  return responseJson.images;
};

const deleteImage = async (imageId: string, token: string | null) => {
  const res: any = await deleteFile(imageId, token as string);

  const responseJson = await res.json();
  // if (responseJson.status == 1) {
  //   alert('Upload Successful');
  // }

  return responseJson.images;
};

export default function SingleImagePicker(props: any) {
  const { image, setImages, setError, allowImageChaning } = props;
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const token = useSelector(getTokenSelector);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        } else {
          // console.log('GRANTED!!');
        }
      }
    })();
  }, []);

  const onOpenImagePicker = async (imageId?: string) => {
    if (!allowImageChaning || loadingImage) {
      return;
    }

    const result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    if (result.cancelled) {
      return;
    }

    const uri = result.uri;
    const a = uri.split('.');

    if (result.width <= 600 || result.height <= 600) {
      setError('Image must be a size of at least 600x600.');

      return;
    }

    setLoadingImage(true);
    const userImages: { uri: string }[] = await uploadImage({
      uri,
      name: 'image',
      type: `image/${a[a.length - 1]}`,
      width: result.width,
      height: result.height
    }, token, imageId);

    // console.log('IMGA:', userImages);
    setLoadingImage(false);
    setImages(userImages);
  };

  const onRemoveImage = async (image: any) => {
    if (!allowImageChaning || loadingImage) {
      return;
    }

    setLoadingImage(true);
    const newImages = await deleteImage(image.imageId, token);

    setLoadingImage(false);
    setImages(newImages);
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
      <TouchableRipple
        onPress={() => onOpenImagePicker(image?.imageId)}
        rippleColor="rgba(0, 0, 0, .32)"
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
                  size={25}
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
                <MaterialCommunityIcons name="plus-circle" size={55} />
              </View>
            )
          )}
        </View>
      </TouchableRipple>
    </View>
  );
}
