import React, { useEffect } from 'react';
import { View, Image, Dimensions } from 'react-native';
import CBottomTabs from '../navigation/CBottomTabs';
import CustomProfileInfoHeader from '../navigation/CustomProfileInfoHeader';
import { Button, TouchableRipple, Title, Colors, Text } from 'react-native-paper';
import { getProfileInfo } from '../services/api';
import { handleError, isVerified, retryHttpRequest } from '../utils';
import { useDispatch, useSelector } from 'react-redux';
import { getLoggedUserIdSelector, getTokenSelector } from '../store/selectors/auth';
import { useIsMounted } from '../hooks/useIsMounted';
import { getDefaultImage } from '../components/DefaultImages';
import { getProfileInfoLoadingSelector, getProfileInfoSelector } from '../store/selectors/profileInfo';
import { clearProfileScreenInfo, fetchProfileScreenInfo, setProfileScreenInfo } from '../store/actions/profileInfo';
import VerifiedBadge from '../components/VerifiedBadge';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import PageLoader from '../components/common/PageLoader';
import EStyleSheet from 'react-native-extended-stylesheet';

const VERIFICATION_COLOR = Colors.blue400;

const styles = EStyleSheet.create({
  title: {
    fontSize: '23rem'
  },
  container: {
    marginTop: '40rem',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  verificationText: {
    color: VERIFICATION_COLOR,
    fontSize: '15rem',
  },
});

const { width } = Dimensions.get('screen');
export const IMAGE_SIZE = width / 2;

export default function ProfileInfoScreen(props: any) {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  const { t } = useTranslation();

  // const [profile, setProfile] = useState<any>(null);
  // const [loading, setLoading] = useState(true);
  const loggedUserId = useSelector(getLoggedUserIdSelector);
  const loading = useSelector(getProfileInfoLoadingSelector);
  const profile = useSelector(getProfileInfoSelector);
  const token = useSelector(getTokenSelector);

  useEffect(() => {
    dispatch(fetchProfileScreenInfo());

    retryHttpRequest(() => {
      if (!isMounted.current) return null;

      return getProfileInfo(token as string);
    })
      // .then(throwErrorIfErrorStatusCode)
      .then((result: any) => result.json())
      .then(result => {
        if (!isMounted.current) return;

        dispatch(setProfileScreenInfo(result));
        // setProfile(result);
        // setLoading(false);
      })
      .catch(e => {
        handleError(e, dispatch);
      });
    // return () => {
    //   dispatch(clearProfileScreenInfo());
    // };
  }, []);

  if (loading) {
    return (
      <View style={{
        flex: 1
      }}>
        <CustomProfileInfoHeader />
        <PageLoader />
        <CBottomTabs />
      </View>
    );
  }

  return (
    <View style={{
      flex: 1
    }}>
      <CustomProfileInfoHeader />

      <View style={{
        flex: 1
      }}>
        <View style={styles.container}>
          <TouchableRipple
            onPress={() => props.navigation.navigate('Profile', { userId: loggedUserId })}
            style={{
              width: '50%',
              aspectRatio: 1,
              borderRadius: 500,
            }}>
            <Image
              source={{ uri: profile.profileImage?.uri_big ?? getDefaultImage(profile.gender).uri }}
              style={{
                width: '100%',
                aspectRatio: 1,
                borderRadius: 500
              }}
            />
          </TouchableRipple>
        </View>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center'
        }}>
          <View>
            <View style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Title style={styles.title}>{profile.name}, {profile.age}</Title>
              {isVerified(profile.verification_status) && <VerifiedBadge />}
            </View>
            <View>
              {(!['verified', 'pending'].includes(profile.verification_status)) && (
                <Button
                  uppercase={false}
                  mode="text"
                  color={VERIFICATION_COLOR}
                  onPress={() => {
                    navigation.navigate('Verification');
                    // dispatch(showVerifyModal());
                  }}
                >{t('Verify yourself with photo')}</Button>
              )}
              {profile.verification_status === 'pending' && (
                <Text
                  style={styles.verificationText}
                >{t('Verification request is processed')}</Text>
              )}
            </View>
          </View>
        </View>
      </View>
      <CBottomTabs />
    </View>
  );
}
