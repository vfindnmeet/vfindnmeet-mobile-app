import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { getInterests, getProfile, getProfileQuestions } from '../services/api';
import { handleError, retryHttpRequest } from '../utils';
import { useDispatch, useSelector } from 'react-redux';
import { clearProfile, fetchProfile, setProfile } from '../store/actions/profile';
import { setAllInterests, setAllProfileQuestions } from '../store/actions/common';
import Info from '../components/profileInfo/info';
import Questions from '../components/profileInfo/Questions';
import Interests from '../components/profileInfo/Interests';
import Gallery from '../components/profileInfo/Gallery';
import Description from '../components/profileInfo/Description';
import Title from '../components/profileInfo/Title';
import { getProfileSelector } from '../store/selectors/profile';
import { getTokenSelector } from '../store/selectors/auth';
import { useIsMounted } from '../hooks/useIsMounted';
import { useNavigation } from '@react-navigation/native';
import useRouteTrack from '../hooks/useRouteTrack';
import Personality from '../components/profileInfo/Personality';
import { useTranslation } from 'react-i18next';
import BaseHeader from '../navigation/BaseHeader';
import BackButton from '../navigation/BackButton';
import PageLoader from '../components/common/PageLoader';

function EditProfileHeader(props: any) {
  const navigation: any = useNavigation();
  const { t } = useTranslation();

  return (
    <BaseHeader
      text={t('Edit Profile')}
      leftButton={<BackButton />}
    />
  );
}

export default function EditProfileScreen(props: any) {
  const dispatch = useDispatch();

  useRouteTrack();
  // const route = useRoute();
  // useEffect(() => {
  //   dispatch(setRoute({
  //     routeName: route.name,
  //     params: route.params
  //   }));

  //   return () => {
  //     dispatch(clearRoute());
  //   };
  // }, []);

  const isMounted = useIsMounted();

  const token = useSelector(getTokenSelector);
  const profile: any = useSelector(getProfileSelector);
  const loadingProfile: any = useSelector(({ profile }: any) => profile.loading ?? true);
  const personalityType: any = useSelector(({ profile }: any) => profile.profile?.info?.personality_type);

  const allInterests: any = useSelector(({ common }: any) => common.interests);
  const allProfileQuestions: any = useSelector(({ common }: any) => common.profileQuestions);

  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (allInterests) {
      return;
    }

    retryHttpRequest(() => {
      if (!isMounted.current) return null;

      return getInterests(token as string);
    })
      // .then(throwErrorIfErrorStatusCode)
      .then((result: any) => result.json())
      .then(interests => {
        dispatch(setAllInterests(interests));
      })
      .catch(e => {
        handleError(e, dispatch);
      });
  }, []);

  useEffect(() => {
    if (allProfileQuestions) {
      return;
    }

    retryHttpRequest(() => {
      if (!isMounted.current) return null;

      return getProfileQuestions(token as string);
    })
      // .then(throwErrorIfErrorStatusCode)
      .then((result: any) => result.json())
      .then(allProfileQuestions => {
        dispatch(setAllProfileQuestions(allProfileQuestions));
      })
      .catch(e => {
        handleError(e, dispatch);
      });
  }, []);

  // useEffect(() => {
  //   if (!loadingProfile && allInterests && allProfileQuestions) {
  //     setLoading(false);
  //   }
  // }, [allInterests, allProfileQuestions, loadingProfile]);

  useEffect(() => {
    dispatch(fetchProfile());
    retryHttpRequest(() => {
      if (!isMounted.current) return null;

      return getProfile(token as string);
    })
      // .then(throwErrorIfErrorStatusCode)
      .then((result: any) => result.json())
      .then(json => {
        if (!isMounted.current) return;

        dispatch(setProfile(json));
      })
      .catch(e => {
        handleError(e, dispatch);
      });

    return () => {
      dispatch(clearProfile());
    }
  }, []);

  // if (loading) {
  if (loadingProfile || !allInterests || !allProfileQuestions) {
    return (
      <View style={{
        flex: 1
      }}>
        <EditProfileHeader />
        <PageLoader />
        {/* <CBottomTabs /> */}
      </View>
    )
  }

  return (
    <View style={{
      flex: 1
    }}>
      <EditProfileHeader />
      <ScrollView style={{
        flex: 1
      }}>
        <Gallery images={profile.images ?? []} userId={profile.id} />
        <Title work={profile.work} education={profile.education} />
        <Description description={profile.description} />
        <Info info={profile.info} />
        <Personality personality={personalityType} />
        <Interests selectedInterests={profile.selectedInterests} />
        <Questions questionAnswers={profile.questionAnswers} />
      </ScrollView>

      {/* <CBottomTabs /> */}
    </View >
  );
}
