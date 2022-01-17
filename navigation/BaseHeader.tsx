import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useDispatch } from 'react-redux';
import { showSearchPrefModal } from '../store/actions/modal';

export default function BaseHeader({ text, leftButton }: any) {
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
        {!!text && (
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
              fontSize: 18,
              fontWeight: 'bold'
            }}>{text}</Text>
          </View>
        )}
        {!!leftButton && leftButton}
      </View>
    </SafeAreaView>
  );
}
