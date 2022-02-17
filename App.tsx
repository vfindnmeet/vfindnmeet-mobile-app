import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store/store';
import Main from './Main';
import './i18n/i18n.config';
import { MAIN_COLOR } from './constants';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Dimensions } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import useLanguage from './hooks/useLanguage';

import messaging from '@react-native-firebase/messaging';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: MAIN_COLOR, //'#3498db',
    accent: MAIN_COLOR,
    // accent: '#f1c40f',
  },
};

const { width } = Dimensions.get('window');
EStyleSheet.build({ $rem: width / 380 });
// EStyleSheet.build({
//   $rem: width > 340 ? 18 : 16
// });

// alert(width / 380)

export default function App() {
  useLanguage();

  return (
    <SafeAreaProvider>
      <ReduxProvider store={store}>
        <NavigationContainer>
          <PaperProvider theme={theme}>
            <Main />
          </PaperProvider>
        </NavigationContainer>
      </ReduxProvider>
    </SafeAreaProvider>
  );
}
