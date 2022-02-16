import React, { useEffect, useRef, useState } from 'react';
import { Image, Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { getLoggedUserIdSelector } from '../../store/selectors/auth';
import { getIntroMessageModalDataSelector } from '../../store/selectors/modal';
import { Camera } from 'expo-camera';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { getVerifyImage } from '../DefaultImages';
import { useTranslation } from 'react-i18next';
import { requestCameraPermissions } from '../../utils';
import { LOADER_SIZE } from '../../constants';

export default function VerifyDialog({ show, onHide }: any) {
  const data: any = useSelector(getIntroMessageModalDataSelector);
  const loggedUserId = useSelector(getLoggedUserIdSelector);

  const { t } = useTranslation();

  // const [hasPermission, setHasPermission] = useState<any>(null);
  // const [type, setType] = useState(Camera.Constants.Type.front);
  // const [image, setImage] = useState<{
  //   uri: string;
  //   width: number;
  //   height: number;
  // } | null>(null);
  const [verifying, setVerifying] = useState(false);

  const hide = () => {
    onHide();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      onDismiss={() => {
        console.log('ON DISMISS');
      }}
    >
      <TouchableWithoutFeedback
        style={{ flex: 1 }}
      >
        <View style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          padding: 15
        }}>
          <TouchableWithoutFeedback>
            <View style={{
              backgroundColor: '#fff',
              padding: 5,
              borderRadius: 5
            }}>
              <View style={{
                position: 'relative'
              }}>
                {verifying ? (
                  <Verify />
                ) : (
                  <View>
                    <View style={{
                      marginBottom: 5
                    }}>
                      <Text>{t('Why should I verify my profile?')}</Text>
                      <Text>{t('You show people that it\'s really you')}</Text>
                      <Text>{t('How does verification work?')}</Text>
                      <Text>{t('')}Take a photo (from your current device) with the target gesture and submit it.</Text>
                      <Text>{t('')}The verification photo will be compared to your profile picture</Text>
                      {!data.profileImageId && (
                        <Text>{t('')}You must upload a profile image before you request verification.</Text>
                      )}
                      <Text>- {t('')}Take a photo with the target gesture bellow</Text>
                      <Text>- {t('')}Click on photo or 'Start verification' button to start</Text>
                      <Text>- {t('')}Submit for verification after photo is taken</Text>
                    </View>
                    {/* <Text>You must allow access to camera in order to take photo</Text> */}

                    <Button
                      uppercase={false}
                      mode="outlined"
                      onPress={() => {
                        setVerifying(true);
                      }}
                    >{t('Start verification')}</Button>
                    <Button
                      uppercase={false}
                      mode="outlined"
                      onPress={() => {
                        setVerifying(true);
                      }}
                      style={{
                        marginTop: 5
                      }}
                    >{t('Cancel')}</Button>
                  </View>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback >
    </Modal >
  );
};

function Verify({ gender }: any) {
  const data = useSelector(getIntroMessageModalDataSelector);
  const loggedUserId = useSelector(getLoggedUserIdSelector);
  const [hasPermission, setHasPermission] = useState<any>(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [image, setImage] = useState<{
    uri: string;
    width: number;
    height: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const cameraRef = useRef<any>(null);
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      setHasPermission(await requestCameraPermissions());
      // const { status }: any = await Camera.requestCameraPermissionsAsync();
      // console.log('status:', status);
      // setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>{t('')}No access to camera</Text>;
  }

  const takePicture = () => {
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
        console.log(photo);
        setImage(photo);
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    })();
  };

  return (
    <View style={{
      position: 'relative'
    }}>
      {loading && (
        <View style={{
          position: 'absolute',
          width: '100%',
          height: 400,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
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
              height: 400
              // aspectRatio: +(image.width / image.height).toFixed(2)
            }}
          // resizeMethod="resize"
          // resizeMode="contain"
          // style={{
          //   width: '100%'
          // }}
          />
          <Button
            uppercase={false}
            mode="outlined"
            onPress={() => {
              setImage(null);
            }}
            style={{
              marginTop: 5
            }}
          >{t('Retake picture')}</Button>
          <Button
            uppercase={false}
            mode="outlined"
            onPress={() => {
              // setImage(null);
            }}
            style={{
              marginTop: 5
            }}
          >{t('Send for verification')}</Button>
        </>
      )}

      {!image && (
        <View style={{
          width: '100%',
          position: 'relative'
        }}>
          <TouchableOpacity
            onPress={takePicture}
          >
            <Camera
              ref={cameraRef}
              type={type}
              useCamera2Api={true}
              style={{
                width: '100%',
                borderWidth: 1,
                borderColor: '#000',
                height: 400
              }}
            />
          </TouchableOpacity>
          <Image
            source={{
              uri: getVerifyImage(gender).uri
            }}
            style={{
              width: 150,
              aspectRatio: 1,
              position: 'absolute',
              top: 0,
              left: 0
            }}
          />

          <Button
            uppercase={false}
            mode="outlined"
            onPress={takePicture}
          >{t('Take picture')}</Button>
        </View>
      )}
    </View>
  );
};
