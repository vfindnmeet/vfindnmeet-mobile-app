import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { setProfile } from '../../store/actions/profile';
import { getProfileSelector } from '../../store/selectors/profile';
import SingleImagePicker from '../SingleImagePicker';

export default function Gallery({ images, userId }: any) {
  const dispatch = useDispatch();
  const navigation: any = useNavigation();

  const profile: any = useSelector(getProfileSelector);

  console.log('images:', images);
  const imgs: any[] = [];
  for (let i = 0; i < 9; i++) {
    imgs.push(images[i] ?? null);
  }

  const renderImg = (image: any, imgIx: number) => {
    if (!image) {
      return (
        <SingleImagePicker
          allowImageChaning={true}
          setImages={(images: any[]) => {
            dispatch(setProfile({
              ...profile,
              images
            }));
          }}
        />
      )
    }

    return (
      <TouchableRipple onPress={() => openGallery(imgIx)} style={{
        width: '100%',
        aspectRatio: 1
      }}>
        <Image source={{ uri: image.uri_big }} style={{ width: '100%', aspectRatio: 1 }} />
      </TouchableRipple>
    )
  };

  const openGallery = (selectedIndex: number) => navigation.navigate('GalleryDialog', {
    images: imgs,
    selectedIndex,
    userId
  });

  return (
    <>
      <View style={{
        display: 'flex',
        flexDirection: 'row'
      }}>
        <View style={{
          width: '66%',
          padding: 1
        }}>
          {renderImg(imgs[0], 0)}
        </View>

        <View style={{
          display: 'flex',
          flexDirection: 'column',
          width: '33%'
        }}>
          <View style={{ padding: 1 }}>
            {renderImg(imgs[1], 1)}
          </View>

          <View style={{ padding: 1 }}>
            {renderImg(imgs[2], 2)}
          </View>
        </View>
      </View>

      <View style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
      }}>
        {imgs.slice(3).map((image: any, ix: number) => (
          <View key={image ? image.imageId : ix} style={{
            // flex: ix == 0 ? 2 : 1
            width: '33%',
            padding: 1
          }}>
            {renderImg(image, 3 + ix)}
          </View>
        ))}
      </View>
    </>
  );
}
