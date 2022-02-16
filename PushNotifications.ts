// import * as Notifications from 'expo-notifications';
// import config from './config';
// import { requestNotificationsPermissions } from './utils';

// export const getExpoPushNotificationToken: () => Promise<string | null> = async () => {
//   const granted = await requestNotificationsPermissions();
//   console.log('granted', granted);
//   if (!granted) {
//     return null;
//   }
//   console.log('-1-');

//   // const token = await Notifications.getExpoPushTokenAsync();
//   const token = await Notifications.getExpoPushTokenAsync({ experienceId: config.EXPERIENCE_ID });
//   // ExponentPushToken[AfNbOAM4nMRTLvfLabmDiq]
//   // ExponentPushToken[AfNbOAM4nMRTLvfLabmDiq]
//   console.log('-2-');
//   console.log('TOKEN:', token);

//   return token?.data;
// }
