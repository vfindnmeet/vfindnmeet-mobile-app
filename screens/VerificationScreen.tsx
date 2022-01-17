import React, { useEffect, useRef, useState } from 'react';
import CBottomTabs from '../navigation/CBottomTabs';
import VerifyHeader from '../navigation/VerifyHeader';
import { useSelector } from 'react-redux';
import { getLoggedUserIdSelector, getTokenSelector } from '../store/selectors/auth';
import { getVerifyImage } from '../components/DefaultImages';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Button, Headline, Subheading } from 'react-native-paper';
import { Camera } from 'expo-camera';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { getProfileInfo, uploadImageForVerification } from '../services/api';
import { getImageMimeType, retryHttpRequest, throwErrorIfErrorStatusCode } from '../utils';
import { useIsMounted } from '../hooks/useIsMounted';
import { useTranslation } from 'react-i18next';

export default function VerificationScreen({ }: any) {
  const isMounted = useIsMounted();
  const loggedUserId = useSelector(getLoggedUserIdSelector);
  const token = useSelector(getTokenSelector);
  const { t } = useTranslation();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    (async () => {
      const { status }: any = await Camera.requestCameraPermissionsAsync();
      console.log('status:', status);
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    retryHttpRequest(getProfileInfo.bind(null, token as string))
      // .then(throwErrorIfErrorStatusCode)
      .then((result: any) => result.json())
      .then(result => {
        if (!isMounted.current) return;

        setData(result);
        setLoading(false);
      });
  }, []);

  if (loading || hasPermission === null) {
    return (
      <VerifyPage>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <ActivityIndicator size={70} />
        </View>
      </VerifyPage>
    );
  }

  console.log(data);

  if (0 && !data?.profile_image_id) {
    return (
      <VerifyPage>
        <Text>{t('You must upload a profile image before you request verification.')}</Text>
      </VerifyPage>
    );
  }

  if (hasPermission === false) {
    return (
      <VerifyPage>
        <Text>{t('No access to camera.')}</Text>
      </VerifyPage>
    );
  }

  return (
    <VerifyPage>
      {verifying ? (
        <Verify />
      ) : (
        step === 1 ? (
          <View>
            <View style={{
              paddingLeft: 15,
              paddingRight: 15
            }}>
              <Headline>{t('Why should I verify my profile?')}</Headline>
              <Subheading>{t('You show people that it\'s really you')}</Subheading>
              <Headline>{t('How does verification work?')}</Headline>
              <Subheading>- {t('Take a photo with the target gesture and submit it')}</Subheading>
              <Subheading>- {t('The verification photo will be compared to your profile picture')}</Subheading>
            </View>

            <Button
              uppercase={false}
              mode="outlined"
              onPress={() => {
                // setVerifying(true);
                setStep(2);
              }}
              style={{
                marginTop: 5
              }}
            >{t('Start verification')}</Button>
          </View>
        ) : (
          <View>
            <View style={{
              // marginBottom: 5,
              paddingLeft: 15,
              paddingRight: 15
            }}>
              <Headline>{t('How does verification work?')}</Headline>
              <Subheading>- {t('Take a photo with the target gesture bellow')}:</Subheading>
              <TouchableOpacity
                onPress={() => {
                  setVerifying(true);
                }}
              >
                <Image
                  source={{
                    uri: getVerifyImage(data.gender).uri
                  }}
                  style={{
                    width: '100%',
                    aspectRatio: 1
                  }}
                />
              </TouchableOpacity>
              <Subheading>- {t('Click on photo or \'Start verification\' button to start')}</Subheading>
              <Subheading>- {t('Submit for verification after photo is taken')}</Subheading>
            </View>

            <Button
              uppercase={false}
              mode="outlined"
              onPress={() => {
                setVerifying(true);
              }}
              style={{
                marginTop: 5
              }}
            >{t('Start verification')}</Button>
          </View>
        )
      )}
    </VerifyPage>
  );
};

function Verify({ gender }: any) {
  // const data = useSelector(getIntroMessageModalDataSelector);
  const loggedUserId = useSelector(getLoggedUserIdSelector);
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

  // useEffect(() => {
  //   (async () => {
  //     const { status }: any = await Camera.requestCameraPermissionsAsync();
  //     console.log('status:', status);
  //     setHasPermission(status === 'granted');
  //   })();
  // }, []);

  // if (hasPermission === null) {
  //   return <View />;
  // }
  // if (hasPermission === false) {
  //   return <Text>No access to camera</Text>;
  // }

  if (complete) {
    return (
      <View>
        <Text style={{
          textAlign: 'center',
          fontSize: 20
        }}>{t('Verification request sent!')}</Text>
      </View>
    );
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
          <ActivityIndicator size={50} />
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
            disabled={uploading}
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
            disabled={uploading}
            loading={uploading}
            onPress={() => {
              setUploading(true);

              uploadImageForVerification({
                ...image,
                name: 'verification_image',
                type: getImageMimeType(image.uri)
              }, token)
                .then(throwErrorIfErrorStatusCode)
                .then(() => {
                  setComplete(true);
                })
                .finally(() => {
                  setUploading(false);
                });
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
                aspectRatio: 1
                // borderWidth: 1,
                // borderColor: '#000',
                // height: 400
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
            style={{
              marginTop: 5
            }}
          >{t('Take picture')}</Button>
        </View>
      )}
    </View>
  );
};

function VerifyPage({ children }: any) {
  return (
    <View style={{
      flex: 1
    }}>
      <VerifyHeader />
      <ScrollView style={{
        flex: 1,
        padding: 5
      }}>
        {children}
      </ScrollView>
      <CBottomTabs />
    </View>
  );
}
