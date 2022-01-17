import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import ActionItemCont from '../components/profile-actions/ActionItemCont';
import ActionsCont from '../components/profile-actions/ActionsCont';
import DislikeButton from '../components/profile-actions/DislikeButton';
import LikeButton from '../components/profile-actions/LikeButton';
import UserProfile from '../components/UserProfile';
import useRouteTrack from '../hooks/useRouteTrack';
import CBottomTabs from '../navigation/CBottomTabs';
import SearchInfoHeader from '../navigation/SearchInfoHeader';
import { getRecommendations, getSearchPreferences } from '../services/api';
import { clearRecommendations, fetchRecommendations, setRecommendations } from '../store/actions/encounter';
import { clearRoute, setRoute } from '../store/actions/route';
import { getTokenSelector } from '../store/selectors/auth';
import { getRecommendationsLoadingSelector, getRecommendationsSelector } from '../store/selectors/encounter';
import { getSearchPrefSelector } from '../store/selectors/searchPref';
import { retryHttpRequest, throwErrorIfErrorStatusCode } from '../utils';

export default function EncountersScreen(props: any) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

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

  const token = useSelector(getTokenSelector);
  const loading = useSelector(getRecommendationsLoadingSelector);
  const recommendations = useSelector(getRecommendationsSelector);

  const searchPrefereces = useSelector(getSearchPrefSelector);

  // console.log('searchPrefereces:', searchPrefereces);
  const [loadingUser, setLoadingUser] = useState(true);
  // const [recommendations, setRecommendations] = useState<string[]>([]);

  const updateRecommendations = () => {
    dispatch(fetchRecommendations());

    retryHttpRequest(getRecommendations.bind(null, token))
      // .then(throwErrorIfErrorStatusCode)
      .then((result: any) => result.json())
      .then(result => {
        dispatch(setRecommendations(result));
      });
  };

  useEffect(() => {
    if (!searchPrefereces) return;

    console.log('UPDATE SEARCH RECOMMEN!!', searchPrefereces)

    updateRecommendations();
  }, [searchPrefereces?.fromAge, searchPrefereces?.toAge, searchPrefereces?.distance]);

  useEffect(() => {
    updateRecommendations();

    return () => {
      dispatch(clearRecommendations());
    };
  }, []);

  if (loading) {
    return (
      <View style={{
        flex: 1
      }}>
        <SearchInfoHeader />
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
    );
  }

  if (recommendations.length <= 0) {
    return (
      <View style={{
        flex: 1
      }}>
        <SearchInfoHeader />
        <View style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text>{t('No recommendations found.')}</Text>
        </View>
        <CBottomTabs />
      </View>
    );
  }

  // console.log('TID', recommendations[0]);
  // console.log(recommendations);

  const userId: string = recommendations[0].userId;
  const distanceInKm: number = recommendations[0].distanceInKm;

  return (
    <View style={{
      flex: 1
    }}>
      <SearchInfoHeader />
      <View style={{
        flex: 1,
        padding: 10,
      }}>
        <View style={{
          flex: 1,
          borderRadius: 5,
          borderColor: '#dcdcdc',//'gray',
          borderWidth: 1,
          overflow: 'hidden',

          backgroundColor: Colors.white,
          shadowColor: Colors.black,
          shadowOffset: {
            width: 4,
            height: 0,
          },
          shadowOpacity: 1.0,
          shadowRadius: 4,
          elevation: 14,
        }}>
          <UserProfile
            userId={userId}
            distanceInKm={distanceInKm}
            showActions={false}
            setLoadingUser={setLoadingUser}
          />

          {!loadingUser && (
            <ActionsCont>
              <ActionItemCont>
                <DislikeButton userId={userId} />
              </ActionItemCont>
              <ActionItemCont>
                <LikeButton userId={userId} />
              </ActionItemCont>
            </ActionsCont>
          )}
        </View>
      </View>
      <CBottomTabs />
    </View>
  );
}
