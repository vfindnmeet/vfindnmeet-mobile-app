import React, { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import CBottomTabs from '../navigation/CBottomTabs';
import CustomProfileInfoHeader from '../navigation/CustomProfileInfoHeader';
import { ActivityIndicator, Button, TouchableRipple, Text as MatText, Title, Paragraph, Colors, Text } from 'react-native-paper';
import { getProfileInfo } from '../services/api';
import { isVerified, retryHttpRequest, throwErrorIfErrorStatusCode } from '../utils';
import { useDispatch, useSelector } from 'react-redux';
import { getLoggedUserIdSelector, getTokenSelector } from '../store/selectors/auth';

import { useIsMounted } from '../hooks/useIsMounted';
import { getDefaultImage } from '../components/DefaultImages';
import { getProfileInfoLoadingSelector, getProfileInfoSelector } from '../store/selectors/profileInfo';
import { clearProfileInfo, fetchProfileInfo, setProfileInfo } from '../store/actions/profileInfo';
import VerifiedBadge from '../components/VerifiedBadge';
import { useNavigation } from '@react-navigation/native';
import { showVerifyModal } from '../store/actions/modal';
import { useTranslation } from 'react-i18next';

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
    dispatch(fetchProfileInfo());

    retryHttpRequest(getProfileInfo.bind(null, token as string))
      // .then(throwErrorIfErrorStatusCode)
      .then((result: any) => result.json())
      .then(result => {
        if (!isMounted.current) return;

        dispatch(setProfileInfo(result));
        // setProfile(result);
        // setLoading(false);
      });

    return () => {
      dispatch(clearProfileInfo());
    };
  }, []);

  if (loading) {
    return (
      <View style={{
        flex: 1
      }}>
        <CustomProfileInfoHeader />
        <View style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <ActivityIndicator size={70} />
        </View>
        <CBottomTabs />
      </View>
    )
  }

  // console.log(profile.profileImage?.uri_big ?? getDefaultImage(profile.gender).uri);
  // console.log(getDefaultImage(profile.gender).uri);
  // console.log(profile);

  return (
    <View style={{
      flex: 1
    }}>
      <CustomProfileInfoHeader />
      <View style={{
        flex: 1
      }}>
        <View style={{
          marginTop: 35,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center'
        }}>
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
            {/* <Title>{profile.name}, {profile.age} {isVerified(profile.verification_status) && <VerifiedBadge />}</Title> */}
            <View style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Title>{profile.name}, {profile.age}</Title>
              {isVerified(profile.verification_status) && <VerifiedBadge />}
            </View>
            {!!profile.title && <Paragraph style={{ textAlign: 'center' }}>{profile.title}</Paragraph>}
            <View>
              {(!['verified', 'pending'].includes(profile.verification_status)) && (
                <Button
                  uppercase={false}
                  mode="text"
                  color={Colors.blue400}
                  onPress={() => {
                    navigation.navigate('Verification');
                    // dispatch(showVerifyModal());
                  }}
                >{t('Verify yourself with photo')}</Button>
              )}
              {profile.verification_status === 'pending' && (
                <Text
                  style={{
                    color: Colors.blue400
                  }}
                >{t('Verification request is processed')}</Text>
              )}
            </View>
          </View>
        </View>
        <View style={{
          margin: 10,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around'
        }}>
          <Button
            disabled={loading}
            icon="cog"
            mode="outlined"
            color={Colors.black}
            onPress={() => {
              navigation.replace('Settings');
            }}
          >{t('Settings')}</Button>

          <Button
            disabled={loading}
            icon="pen"
            mode="outlined"
            color={Colors.black}
            onPress={() => props.navigation.navigate('EditProfile')}
          >{t('Edit')}</Button>
        </View>
      </View>
      <CBottomTabs />
    </View>
  );
}
