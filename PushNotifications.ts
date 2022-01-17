import * as Notifications from 'expo-notifications';

const requestNotificationsPermission = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus;
};

export const getExpoPushNotificationToken: () => Promise<string | null> = async () => {
  const status = await requestNotificationsPermission();
  if (status !== 'granted') {
    return null;
  }

  const token = await Notifications.getExpoPushTokenAsync();
  console.log('TOKEN:', token);

  return token?.data;
}
