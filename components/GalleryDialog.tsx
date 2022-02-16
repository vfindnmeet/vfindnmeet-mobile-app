import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, IconButton, ActivityIndicator, Colors } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageViewer from 'react-native-image-zoom-viewer';
import ImageMenuDialog from './ImageMenuDialog';
import { deleteUserImage, setProfileImage } from '../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { deleteImage } from '../store/actions/profile';
import { useIsMounted } from '../hooks/useIsMounted';
import { getLoggedUserIdSelector, getTokenSelector } from '../store/selectors/auth';
import { handleError, throwErrorIfErrorStatusCode } from '../utils';
import { setNewProfileImage } from '../store/actions/user';
import { useTranslation } from 'react-i18next';
import UnauthorizedError from '../errors/UnauthorizedError';
import { showErrorModal } from '../store/actions/modal';
import { ICON_SIZE } from '../constants';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    // borderWidth: 4,
    // borderColor: 'green',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    position: 'relative'
  },
  closeIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#000',
    opacity: 0.7,
    borderRadius: 100,
    borderWidth: 1,
  },
  optionsIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.black,
    opacity: 0.7,
    borderRadius: 100,
    borderWidth: 1,
  },
  modalButton: {
    marginTop: '15rem'
  },
});

export default function GalleryDialog({ route, navigation }: any) {
  const { userId, images, selectedIndex } = route.params;

  const isMounted = useIsMounted();
  const dispatch = useDispatch();

  // const [visible, setVisible] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [settingProfileImage, setSettingProfileImage] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [currentIndex, setCurrentIndex] = useState<number>(selectedIndex ?? 0);
  const [ix, setIx] = useState<number>(selectedIndex ?? 0);
  const [galleryImages, setGalleryImages] = useState<any[]>(images);

  const token = useSelector(getTokenSelector);
  const loggedUserId = useSelector(getLoggedUserIdSelector);

  const { t } = useTranslation();

  // useEffect(() => {
  //   setVisible(show);
  // }, [show]);

  return (
    <>
      <SafeAreaView></SafeAreaView>
      <View style={styles.container}>
        <ImageViewer
          imageUrls={galleryImages.filter(Boolean).map((image: any) => ({ url: image.uri_big }))}
          index={ix}
          onChange={(ix: any) => {
            // console.log('SET IX', ix);
            setCurrentIndex(ix);
          }}
        />

        <IconButton
          icon="close"
          size={ICON_SIZE}
          color={Colors.white}
          onPress={() => navigation.goBack()}
          style={styles.closeIcon}
        />
        {userId === loggedUserId && (
          <IconButton
            icon="dots-vertical"
            size={ICON_SIZE}
            color={Colors.white}
            onPress={() => setShowMenu(true)}
            style={styles.optionsIcon}
          />
        )}
      </View>

      <ImageMenuDialog show={showMenu} onHide={() => {
        if (deleting || settingProfileImage) {
          return;
        }

        setShowMenu(false);
      }}>
        <Button
          style={styles.modalButton}
          mode="text"
          uppercase={false}
          loading={settingProfileImage}
          disabled={deleting || settingProfileImage}
          onPress={() => {
            if (deleting || settingProfileImage) return;

            const targetImageId = galleryImages[currentIndex].imageId;

            setSettingProfileImage(true);

            setProfileImage(targetImageId, token)
              .then(throwErrorIfErrorStatusCode)
              .then(response => response.json())
              .then((imageData: any) => {
                // console.log('MAKE PROFILE PIC!!!!', imageData)
                // dispatch(setNewProfileImage(targetImageId));
                dispatch(setNewProfileImage(imageData));

                if (!isMounted.current) return;

                // setSettingProfileImage(false);
                setShowMenu(false);
              })
              // .catch((e) => {
              //   if (e instanceof UnauthorizedError) {}
              //   else {
              //     dispatch(showErrorModal({ message: 'Internal server error.' }));
              //   }
              // })
              .catch(err => {
                handleError(err, dispatch);
              })
              .finally(() => {
                if (!isMounted.current) return;

                setSettingProfileImage(false);
              });
          }}
        >
          {t('Make profile picture')}
        </Button>
        <Button
          style={styles.modalButton}
          mode="text"
          loading={deleting}
          disabled={deleting || settingProfileImage}
          uppercase={false}
          onPress={() => {
            if (deleting || settingProfileImage) return;

            setDeleting(true);

            const targetImageId = galleryImages[currentIndex].imageId;
            deleteUserImage(targetImageId, token)
              .then(throwErrorIfErrorStatusCode)
              .then(response => response.json())
              .then(({ errMsg }) => {
                if (errMsg) {
                  dispatch(showErrorModal({ message: errMsg }));
                  return;
                }

                dispatch(deleteImage(targetImageId));

                if (!isMounted.current) return;

                const galleryLength = galleryImages.filter(Boolean).length;

                if (galleryLength === 1) {
                  navigation.goBack();

                  return;
                }

                setShowMenu(false);

                if (galleryLength - 1 === currentIndex) {
                  setIx(currentIndex - 1);
                  setCurrentIndex(currentIndex - 1);
                }

                galleryImages.filter((image: any) => image?.imageId !== targetImageId);
                // setDeleting(false);
                setGalleryImages(galleryImages.filter((image: any) => image?.imageId !== targetImageId));
              })
              // .catch((e) => {
              //   if (e instanceof UnauthorizedError) {
              //     // 
              //   } else {
              //     dispatch(showErrorModal({ message: e.message ?? 'Internal server error.' }));
              //   }
              // })
              .catch(err => {
                handleError(err, dispatch);
              })
              .finally(() => {
                if (!isMounted.current) return;

                setDeleting(false);
              });

            // dispatch(deleteImage(targetImageId));

            // if (!isMounted.current) return;

            // const galleryLength = galleryImages.filter(Boolean).length;

            // if (galleryLength === 1) {
            //   navigation.goBack();

            //   return;
            // }

            // setShowMenu(false);

            // if (galleryLength - 1 === currentIndex) {
            //   setIx(currentIndex - 1);
            // }

            // galleryImages.filter((image: any) => image?.imageId !== targetImageId);
            // setGalleryImages(galleryImages.filter((image: any) => image?.imageId !== targetImageId));
            // setDeleting(false);


            // dispatch(deleteImage(targetImageId));
            // setGalleryImages(galleryImages.filter((image: any) => image?.imageId !== targetImageId));
            // setShowMenu(false);
            // deleteFile(image.imageId, token as string)
          }}
        >
          {deleting && <ActivityIndicator />} {t('Delete')}
        </Button>
      </ImageMenuDialog>
    </>
  );
}
