import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseHeader from './BaseHeader';
import BackButton from './BackButton';

export default function VerifyHeader(props: any) {
  const { t } = useTranslation();

  return (
    <BaseHeader
      text={t('Verification')}
      leftButton={<BackButton />}
    />
  );

  // return (
  //   <SafeAreaView>
  //     <View style={{
  //       height: 40,
  //       display: 'flex',
  //       flexDirection: 'row',
  //       justifyContent: 'space-between',
  //       alignItems: 'center'
  //     }}>
  //       {/* <IconButton
  //         icon="cog-outline"
  //         size={ICON_SIZE}
  //         onPress={() => navigation.replace('GeneralSettings')}
  //       /> */}
  //       <Text style={{ flex: 1, textAlign: 'center' }}>{t('Verification')}</Text>
  //       <Text></Text>
  //     </View>
  //   </SafeAreaView>
  // );
}
