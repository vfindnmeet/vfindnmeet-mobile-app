import React, { useEffect, useContext, useState } from 'react';
import { Image, View, Platform, TouchableWithoutFeedback } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadFile2 } from '../services/api';
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
  token: string | null
) => {
  const res = await uploadFile2(fileToUpload, token as string);

  const responseJson = await res.json();

  return responseJson;
};

export default function ImagePicker1(props: any) {
  const { onUpload, onStartUpload, shouldUpload, setError, children } = props;
  const [loading, setLoading] = useState<boolean>(false);
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

  const onOpenImagePicker = async () => {
    if (loading) {
      return;
    }

    if (shouldUpload && !shouldUpload()) {
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

    onStartUpload && onStartUpload();
    setLoading(true);
    const image: { imageId: string; uri_big: string; uri_small: string } = await uploadImage({
      uri,
      name: 'image',
      type: `image/${a[a.length - 1]}`,
      width: result.width,
      height: result.height
    }, token);

    // console.log('IMGA:', image);
    // setImages(image);
    onUpload(image);
    setLoading(false);
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => onOpenImagePicker()}
    >
      {children}
    </TouchableWithoutFeedback>
  );
}
