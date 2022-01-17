import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export default function VerifyHeader(props: any) {
  const navigation: any = useNavigation();
  const { t } = useTranslation();

  return (
    <SafeAreaView>
      <View style={{
        height: 40,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* <IconButton
          icon="cog-outline"
          size={26}
          onPress={() => navigation.replace('GeneralSettings')}
        /> */}
        <Text style={{ flex: 1, textAlign: 'center' }}>{t('Verification')}</Text>
        <Text></Text>
      </View>
    </SafeAreaView>
  );
}
