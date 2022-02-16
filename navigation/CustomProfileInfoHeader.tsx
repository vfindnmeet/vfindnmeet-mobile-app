import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { Appbar, Colors, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ICON_SIZE } from '../constants';
import BaseHeader from './BaseHeader';

export default function CustomProfileInfoHeader(props: any) {
  const navigation: any = useNavigation();
  const { t } = useTranslation();

  return (
    <BaseHeader
      text={t('Profile info')}
      leftButton={<IconButton
        icon="cog-outline"
        size={ICON_SIZE}
        style={{
          backgroundColor: Colors.grey300
        }}
        onPress={() => {
          // navigation.replace('GeneralSettings');
          navigation.navigate('Settings');
        }}
      />}
      rightButton={<IconButton
        icon="account-edit-outline"
        size={ICON_SIZE}
        style={{
          backgroundColor: Colors.grey300
        }}
        onPress={() => {
          navigation.navigate('EditProfile');
        }}
      />}
    />
  );

  return (
    <SafeAreaView>
      <View style={{
        height: 40,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <IconButton
          icon="cog-outline"
          // color={getColor(route.name === 'Browse')}
          size={ICON_SIZE}
          onPress={() => navigation.replace('GeneralSettings')}
        />
        <Text style={{ flex: 1, textAlign: 'center' }}>App name</Text>
        <Text></Text>
      </View>
    </SafeAreaView>
  );
}
