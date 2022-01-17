// import { NavigationContainer } from '@react-navigation/native';
// import { StatusBar } from 'expo-status-bar';
// import React, { useEffect, useState } from 'react';
// import { Button, StyleSheet, Text, View } from 'react-native';
// import { AppScreen, AuthScreen } from './navigation/Navigator1';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { ActivityIndicator } from 'react-native-paper';
// import { AuthContext } from './contexts/AuthContext';
// import BottomTabs from './navigation/BottomTabs';
// import OnboardingScreen from './screens/OnboardingScreen';
// import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
// import { throwErrorIfErrorStatusCode } from './utils';
// import config from './config';
// import { getOnboardingStep } from './services/api';
// import UnauthorizedError from './errors/UnauthorizedError';
// import { Provider as ReduxProvider, useDispatch, useSelector } from 'react-redux';
// import { store } from './store/store';
// import { getTokenSelector } from './store/selectors/auth';
// import { logOutUser, setLoggedUser } from './store/actions/auth';

// const parseJson = (json: string) => {
//   try {
//     return JSON.parse(json);
//   } catch (e) {
//     return {};
//   }
// }

// function Main() {
//   // const dispatch = useDispatch();

//   const token = '';
//   // const token = useSelector(getTokenSelector);
//   // const [token, setToken] = useState<string | null>(null);
//   const [loadingToken, setLoadingToken] = useState(true);
//   const [onboardingData, setOnboardingData] = useState<{
//     step: number;
//     completed_at: number;
//   } | null>(null);

//   // setTimeout(() => updateToken(null), 4000)

//   console.log('ENTER APP');

//   // useEffect(() => {
//   //   AsyncStorage.getItem('vi-user-data').then(json => {
//   //     // setToken(token);
//   //     if (!json) {
//   //       dispatch(logOutUser());
//   //     } else {
//   //       dispatch(setLoggedUser(parseJson(json)));
//   //     }
//   //     setLoadingToken(false);
//   //   });
//   //   // AsyncStorage.getItem('token').then(token => {
//   //   //   setToken(token);
//   //   //   setLoadingToken(false);
//   //   // });
//   // }, []);




//   // const updateToken = (newToken: string | null) => {
//   //   (
//   //     !newToken ?
//   //       AsyncStorage.removeItem('token') :
//   //       AsyncStorage.setItem('token', newToken)
//   //   ).then(() => {
//   //     setToken(newToken);
//   //   });
//   // };

//   useEffect(() => {
//     if (!token) {
//       return;
//     }

//     const getOnboardingInfo = () => {
//       getOnboardingStep(token)
//         .then(throwErrorIfErrorStatusCode)
//         .then(result => result.json())
//         .then((json: {
//           step: number;
//           completed_at: number;
//         }) => {
//           setOnboardingData(json);
//         })
//         .catch(e => {
//           if (e instanceof UnauthorizedError) {
//             // updateToken(null);
//             // AsyncStorage.removeItem('token').then(() => dispatch(logOutUser()))

//             return;
//           }

//           console.log('err =>', e.message);

//           setTimeout(() => getOnboardingInfo(), 10000);
//         });
//     }

//     getOnboardingInfo();
//   }, [token]);

//   if (loadingToken) {
//     return (
//       <Contexts>
//         <SafeAreaView style={{
//           flex: 1,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center'
//         }}>
//           <ActivityIndicator />
//         </SafeAreaView>
//       </Contexts>
//     );
//   }

//   if (!token) {
//     return (
//       <Contexts>
//         <AuthScreen></AuthScreen>
//       </Contexts>
//     );
//   }

//   const onboardingDataLoading = onboardingData === null;
//   if (onboardingDataLoading) {
//     return (
//       <Contexts>
//         <SafeAreaView style={{
//           flex: 1,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center'
//         }}>
//           <ActivityIndicator />
//         </SafeAreaView>
//       </Contexts>
//     );
//   }

//   const isOnboarding = !onboardingData.completed_at;
//   if (isOnboarding) {
//     return (
//       <Contexts setOnboardingData={setOnboardingData}>
//         <OnboardingScreen curStep={onboardingData?.step ?? 1} />
//       </Contexts>
//     );
//   }

//   return (
//     <Contexts>
//       <AppScreen />
//     </Contexts>
//   );
// }

// export default function App1() {
//   // const dispatch = useDispatch();

//   const token = '';
//   // const token = useSelector(getTokenSelector);
//   // const [token, setToken] = useState<string | null>(null);
//   const [loadingToken, setLoadingToken] = useState(true);
//   const [onboardingData, setOnboardingData] = useState<{
//     step: number;
//     completed_at: number;
//   } | null>(null);

//   // setTimeout(() => updateToken(null), 4000)

//   console.log('ENTER APP');

//   // useEffect(() => {
//   //   AsyncStorage.getItem('vi-user-data').then(json => {
//   //     // setToken(token);
//   //     if (!json) {
//   //       dispatch(logOutUser());
//   //     } else {
//   //       dispatch(setLoggedUser(parseJson(json)));
//   //     }
//   //     setLoadingToken(false);
//   //   });
//   //   // AsyncStorage.getItem('token').then(token => {
//   //   //   setToken(token);
//   //   //   setLoadingToken(false);
//   //   // });
//   // }, []);




//   // const updateToken = (newToken: string | null) => {
//   //   (
//   //     !newToken ?
//   //       AsyncStorage.removeItem('token') :
//   //       AsyncStorage.setItem('token', newToken)
//   //   ).then(() => {
//   //     setToken(newToken);
//   //   });
//   // };

//   useEffect(() => {
//     if (!token) {
//       return;
//     }

//     const getOnboardingInfo = () => {
//       getOnboardingStep(token)
//         .then(throwErrorIfErrorStatusCode)
//         .then(result => result.json())
//         .then((json: {
//           step: number;
//           completed_at: number;
//         }) => {
//           setOnboardingData(json);
//         })
//         .catch(e => {
//           if (e instanceof UnauthorizedError) {
//             // updateToken(null);
//             // AsyncStorage.removeItem('token').then(() => dispatch(logOutUser()))

//             return;
//           }

//           console.log('err =>', e.message);

//           setTimeout(() => getOnboardingInfo(), 10000);
//         });
//     }

//     getOnboardingInfo();
//   }, [token]);

//   if (loadingToken) {
//     return (
//       <Contexts>
//         <SafeAreaView style={{
//           flex: 1,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center'
//         }}>
//           <ActivityIndicator />
//         </SafeAreaView>
//       </Contexts>
//     );
//   }

//   if (!token) {
//     return (
//       <Contexts>
//         <AuthScreen></AuthScreen>
//       </Contexts>
//     );
//   }

//   const onboardingDataLoading = onboardingData === null;
//   if (onboardingDataLoading) {
//     return (
//       <Contexts>
//         <SafeAreaView style={{
//           flex: 1,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center'
//         }}>
//           <ActivityIndicator />
//         </SafeAreaView>
//       </Contexts>
//     );
//   }

//   const isOnboarding = !onboardingData.completed_at;
//   if (isOnboarding) {
//     return (
//       <Contexts setOnboardingData={setOnboardingData}>
//         <OnboardingScreen curStep={onboardingData?.step ?? 1} />
//       </Contexts>
//     );
//   }

//   return (
//     <Contexts>
//       <AppScreen />
//     </Contexts>
//   );
// }

// function Contexts(props: any) {
//   const { setOnboardingData } = props;

//   return (
//     <SafeAreaProvider>
//       <ReduxProvider store={store}>
//         {/* <AuthContext.Provider value={{ token, setToken, setOnboardingData }}> */}
//         <AuthContext.Provider value={{ setOnboardingData }}>
//           <NavigationContainer>
//             {props.children}
//           </NavigationContainer>
//         </AuthContext.Provider>
//       </ReduxProvider>
//     </SafeAreaProvider>
//   );
// }
