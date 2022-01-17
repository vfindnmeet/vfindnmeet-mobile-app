import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import CBottomTabs from '../navigation/CBottomTabs';
import CustomProfileInfoHeader from '../navigation/CustomProfileInfoHeader';
import { ActivityIndicator, Button, TextInput } from 'react-native-paper';
import { getInterests, getProfile, getProfileQuestions, updateProfile } from '../services/api';
import { retryHttpRequest } from '../utils';
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
import { clearRoute, setRoute } from '../store/actions/route';
import { useRoute } from '@react-navigation/native';
import useRouteTrack from '../hooks/useRouteTrack';

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

  const allInterests: any = useSelector(({ common }: any) => common.interests);
  const allProfileQuestions: any = useSelector(({ common }: any) => common.profileQuestions);

  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (allInterests) {
      return;
    }

    retryHttpRequest(getInterests.bind(null, token as string))
      // .then(throwErrorIfErrorStatusCode)
      .then((result: any) => result.json())
      .then(interests => {
        dispatch(setAllInterests(interests));
      })
  }, []);

  useEffect(() => {
    if (allProfileQuestions) {
      return;
    }

    retryHttpRequest(getProfileQuestions.bind(null, token as string))
      // .then(throwErrorIfErrorStatusCode)
      .then((result: any) => result.json())
      .then(allProfileQuestions => {
        dispatch(setAllProfileQuestions(allProfileQuestions));
      })
  }, []);

  // useEffect(() => {
  //   if (!loadingProfile && allInterests && allProfileQuestions) {
  //     setLoading(false);
  //   }
  // }, [allInterests, allProfileQuestions, loadingProfile]);

  useEffect(() => {
    dispatch(fetchProfile());
    retryHttpRequest(getProfile.bind(null, token as string))
      // .then(throwErrorIfErrorStatusCode)
      .then((result: any) => result.json())
      .then(json => {
        if (!isMounted.current) return;

        dispatch(setProfile(json));
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

  return (
    <View style={{
      flex: 1
    }}>
      <CustomProfileInfoHeader />
      <ScrollView style={{
        flex: 1
      }}>
        <Gallery images={profile.images ?? []} userId={profile.id} />
        <Title title={profile.title} />
        <Description description={profile.description} />
        <Info info={profile.info} />
        <Interests selectedInterests={profile.selectedInterests} />
        <Questions questionAnswers={profile.questionAnswers} />
      </ScrollView>

      <CBottomTabs />
    </View >
  );
}
