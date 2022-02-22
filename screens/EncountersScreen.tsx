import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useDispatch, useSelector } from 'react-redux';
import PageLoader from '../components/common/PageLoader';
import ActionsCont from '../components/profile-actions/ActionsCont';
import DislikeButton from '../components/profile-actions/DislikeButton';
import LikeButton from '../components/profile-actions/LikeButton';
import UserProfile from '../components/UserProfile';
import { useIsMounted } from '../hooks/useIsMounted';
import useRouteTrack from '../hooks/useRouteTrack';
import useUserProfile from '../hooks/useUserProfile';
import CBottomTabs from '../navigation/CBottomTabs';
import SearchInfoHeader from '../navigation/SearchInfoHeader';
import { getRecommendations, getSearchPreferences } from '../services/api';
import { clearRecommendations, fetchRecommendations, setRecommendations } from '../store/actions/encounter';
import { getTokenSelector } from '../store/selectors/auth';
import { getRecommendationsLoadingSelector, getRecommendationsSelector } from '../store/selectors/encounter';
import { getSearchPrefSelector } from '../store/selectors/searchPref';
import { handleError, retryHttpRequest, throwErrorIfErrorStatusCode } from '../utils';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    padding: '10rem',
  },
  actionsContainer: {
    justifyContent: 'space-around',
    margin: 0,
    // marginBottom: '-35rem',
    marginTop: -35,
  },
  innerContainer: {
    flex: 1,
    // marginBottom: '35rem'
  },
  noResultsTitle: {
    fontSize: '20rem',
    // fontWeight: 'bold'
  },
  noResultsText: {
    fontSize: '15rem',
  }
});

function UserProf({
  userId,
  distanceInKm,
  showActions
}: {
  userId: string;
  distanceInKm: number;
  showActions: boolean;
}) {
  const [user, allInterests, allProfileQuestions, loading] = useUserProfile(userId);

  if (loading) {
    return (
      <PageLoader />
    );
  }

  return (
    <UserProfile
      user={user}
      allInterests={allInterests}
      allProfileQuestions={allProfileQuestions}
      distanceInKm={distanceInKm}
      showActions={false}
    // userId={props.route.params.userId}
    />
  );
}

export default function EncountersScreen(props: any) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isMounted = useIsMounted();

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
  // const [loadingUser, setLoadingUser] = useState(true);
  // const [recommendations, setRecommendations] = useState<string[]>([]);

  const updateRecommendations = () => {
    dispatch(fetchRecommendations());

    retryHttpRequest(() => {
      if (!isMounted.current) return null;

      return getRecommendations(token);
    })
      // .then(throwErrorIfErrorStatusCode)
      .then((result: any) => result.json())
      .then(result => {
        dispatch(setRecommendations(result));
      })
      .catch(e => {
        handleError(e, dispatch);
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
        <PageLoader />
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
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={styles.noResultsTitle}>{t('No recommendations found.')}</Text>
          <Text style={styles.noResultsText}>{t('Try cheking later.')}</Text>
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
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <UserProf
            userId={userId}
            distanceInKm={distanceInKm}
            showActions={false}
          />
          {/* <UserProfile
            userId={userId}
            distanceInKm={distanceInKm}
            showActions={false}
            setLoadingUser={setLoadingUser}
          /> */}

          {!loading && (
            <ActionsCont style={styles.actionsContainer}>
              <DislikeButton userId={userId} />
              <LikeButton userId={userId} />
              {/* <ActionItemCont>
              </ActionItemCont>
              <ActionItemCont>
              </ActionItemCont> */}
            </ActionsCont>
          )}
        </View>
      </View>
      <CBottomTabs />
    </View>
  );
}
