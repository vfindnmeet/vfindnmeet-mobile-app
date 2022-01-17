import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useDispatch } from 'react-redux';
import { showSearchPrefModal } from '../store/actions/modal';
import BaseHeader from './BaseHeader';

export default function SearchInfoHeader(props: any) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  return (
    <BaseHeader
      text={t('Encounters')}
      leftButton={<IconButton
        icon="tune"
        size={26}
        onPress={() => {
          dispatch(showSearchPrefModal({}));
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
        alignItems: 'center',

        position: 'relative'
      }}>
        <View style={{
          height: 40,
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',

          position: 'absolute',
          top: 0,
          left: 0
        }}>
          <Text style={{
            textAlign: 'center',
          }}>Encounters</Text>
        </View>
        <IconButton
          icon="tune"
          size={26}
          onPress={() => {
            dispatch(showSearchPrefModal({}));
          }}
        />
        {/* <View style={{padding: 10}}></View> */}
      </View>
    </SafeAreaView>
  );
}
