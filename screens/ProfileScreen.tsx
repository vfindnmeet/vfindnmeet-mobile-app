import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserProfile from '../components/UserProfile';
import CBottomTabs from '../navigation/CBottomTabs';
import CustomProfileInfoHeader from '../navigation/CustomProfileInfoHeader';

export default function ProfileScreen(props: any) {
  return (
    <SafeAreaView style={{
      flex: 1
    }}>
      {/* <CustomProfileInfoHeader /> */}
      <View style={{
        flex: 1
      }}>
        <UserProfile userId={props.route.params.userId} showActions={true} />
      </View>
      <CBottomTabs />
    </SafeAreaView>
  );
}
