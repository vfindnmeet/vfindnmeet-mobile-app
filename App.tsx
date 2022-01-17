import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store/store';
import WsContextProvider from './store/WsContext';
import Main from './Main';
import './i18n/i18n.config';
import { useTranslation } from 'react-i18next';
import { getStorageItem } from './utils';
import { STORAGE_LANG_KEY } from './constants';

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    getStorageItem(STORAGE_LANG_KEY)
    .then(lang => {
      i18n.changeLanguage(lang || 'bg');
    });
  }, []);

  return (
    <SafeAreaProvider>
      <ReduxProvider store={store}>
        <WsContextProvider>
          <NavigationContainer>
            <Main />
          </NavigationContainer>
        </WsContextProvider>
      </ReduxProvider>
    </SafeAreaProvider>
  );
}
