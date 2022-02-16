import React from 'react';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import PageLoader from '../components/common/PageLoader';
import Actions from '../components/profile-actions/Actions';
import UserProfile from '../components/UserProfile';
import useUserProfile from '../hooks/useUserProfile';
import CBottomTabs from '../navigation/CBottomTabs';

const styles = EStyleSheet.create({
  pageContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    padding: '10rem',
  },
  innerContainer: {
    flex: 1,
    borderRadius: '5rem',
    overflow: 'hidden',
  },
});

export default function ProfileScreen(props: any) {
  const [user, allInterests, allProfileQuestions, loading] = useUserProfile(props.route.params.userId);

  if (loading) {
    return (
      <PageLoader />
    );
  }

  return (
    <View style={styles.pageContainer}>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <UserProfile
            user={user}
            allInterests={allInterests}
            allProfileQuestions={allProfileQuestions}
            showActions={false}
          />
        </View>

        {!loading && <Actions user={user} />}
      </View>
      <CBottomTabs />
    </View>
  );
}
