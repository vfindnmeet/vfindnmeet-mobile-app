import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import BackButton from '../navigation/BackButton';
import EStyleSheet from 'react-native-extended-stylesheet';
import CBottomTabs from '../navigation/CBottomTabs';

const styles = EStyleSheet.create({
  container: {
    flex: 1
  },
  notFoundUserContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundTitle: {
    fontSize: '25rem',
    fontWeight: 'bold'
  },
  notFoundText: {
    fontSize: '15rem',
  }
});

export default function NotFoundUser({ headerNav, bottomNav }: {
  headerNav?: boolean;
  bottomNav?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {headerNav && (
        <View>
          <BackButton />
        </View>
      )}
      <View style={styles.notFoundUserContainer}>
        <Text style={styles.notFoundTitle}>{t('User not found')}</Text>
        <Text style={styles.notFoundText}>{t('We\'re sorry. The user you\'re searching for was not found.')}</Text>
      </View>
      {bottomNav && <CBottomTabs />}
    </View>
  );
}
