import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLoggedUserIdSelector, getTokenSelector } from '../../store/selectors/auth';
import { getVerifyImage } from '../../components/DefaultImages';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Button, Colors } from 'react-native-paper';
import { Camera } from 'expo-camera';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { uploadImageForVerification } from '../../services/api';
import { getImageMimeType, handleError, throwErrorIfErrorStatusCode } from '../../utils';
import { useIsMounted } from '../../hooks/useIsMounted';
import { useTranslation } from 'react-i18next';
import { LOADER_SIZE } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { setProfileScreenInfo } from '../../store/actions/profileInfo';
import { getProfileInfoSelector } from '../../store/selectors/profileInfo';

const RATIO = { width: 16, height: 14 };
const RATIO_STR = `${RATIO.width}:${RATIO.height}`;
const { width } = Dimensions.get('window');
const height = Math.round((width * RATIO.width) / RATIO.height);

const styles = EStyleSheet.create({
  completeContainer: {
    padding: '10rem',
  },
  completeText: {
    textAlign: 'center',
    fontSize: '20rem',
    backgroundColor: Colors.grey300,
    padding: '15rem',
    borderRadius: '10rem'
  },
  completeButton: {
    marginTop: '15rem'
  },
  container: {
    position: 'relative',
    flex: 1
  },
  loadingContainer: {
    position: 'absolute',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    marginTop: '10rem'
  },
  image: {
    width: '150rem',
    aspectRatio: 1,
    position: 'absolute',
    top: 0,
    left: 0
  }
});

export default function Verify({ gender }: any) {
  // const data = useSelector(getIntroMessageModalDataSelector);
  const isMounted = useIsMounted();
  const dispatch = useDispatch();
  const navigation: any = useNavigation();

  const loggedUserId = useSelector(getLoggedUserIdSelector);
  const profileInfo = useSelector(getProfileInfoSelector);
  const token = useSelector(getTokenSelector);
  const { t } = useTranslation();

  // const [hasPermission, setHasPermission] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [image, setImage] = useState<{
    uri: string;
    width: number;
    height: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);

  const cameraRef = useRef<any>(null);

  if (complete) {
    return (
      <View style={styles.completeContainer}>
        <Text style={styles.completeText}>{t('Verification request sent!')}</Text>
        <Button
          uppercase={false}
          mode='contained'
          labelStyle={{ color: Colors.white }}
          style={styles.completeButton}
          onPress={() => {
            navigation.goBack();
          }}
        >{t('Return to profile')}</Button>
      </View>
    );
  }

  const takePicture = () => {
    if (loading) return;
    if (!cameraRef.current) return;

    setLoading(true);

    (async () => {
      try {
        let photo = await cameraRef.current.takePictureAsync();
        photo = await manipulateAsync(
          photo.localUri || photo.uri,
          [
            { rotate: 180 },
            { flip: FlipType.Vertical },
          ],
          { compress: 1, format: SaveFormat.PNG }
        );

        setImage(photo);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={LOADER_SIZE} />
        </View>
      )}

      {image && !loading && (
        <>
          <Image
            source={{
              uri: image.uri
            }}
            style={{
              width: '100%',
              height: height
            }}
          />
          <Button
            uppercase={false}
            mode="contained"
            labelStyle={{ color: Colors.white }}
            disabled={uploading}
            onPress={() => {
              setImage(null);
            }}
            style={styles.button}
          >{t('Retake picture')}</Button>
          <Button
            uppercase={false}
            mode="contained"
            labelStyle={{ color: Colors.white }}
            disabled={uploading}
            loading={uploading}
            onPress={() => {
              if (uploading) return;

              setUploading(true);

              uploadImageForVerification({
                ...image,
                name: 'verification_image',
                type: getImageMimeType(image.uri)
              }, token)
                .then(throwErrorIfErrorStatusCode)
                .then(() => {
                  if (!isMounted.current) return;

                  setComplete(true);
                  dispatch(setProfileScreenInfo({
                    ...profileInfo,
                    verification_status: 'pending'
                  }));
                })
                .catch(err => {
                  handleError(err, dispatch);
                })
                .finally(() => {
                  if (!isMounted.current) return;

                  setUploading(false);
                });
            }}
            style={styles.button}
          >{t('Send for verification')}</Button>
        </>
      )}

      {!image && (
        <View style={{
          width: '100%',
          position: 'relative',
        }}>
          <TouchableOpacity
            onPress={takePicture}
          >
            <Camera
              ref={cameraRef}
              type={type}
              useCamera2Api={true}
              ratio={RATIO_STR}
              style={{
                height: height,
              }}
            >
              <View style={{ flex: 1 }}></View>
            </Camera>
          </TouchableOpacity>
          <Image
            source={{
              uri: getVerifyImage(gender).uri
            }}
            style={styles.image}
          />

          <Button
            uppercase={false}
            mode="contained"
            labelStyle={{ color: Colors.white }}
            style={styles.button}
            loading={loading}
            disabled={loading}
            onPress={takePicture}
          >{t('Take picture')}</Button>
        </View>
      )}
    </View>
  );
};
