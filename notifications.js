import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

async function registerForPushNotificationsAsync() {
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "It's time for prayer!",
      body: 'Time to perform your prayer.',
      sound: 'adhan.wav',
    },
    trigger: { seconds: 5 }, // For testing, schedules 5 seconds later
  });
}

async function playAdhanSound() {
  const soundObject = new Audio.Sound();
  try {
    await soundObject.loadAsync(require('./assets/adhan.wav'));
    await soundObject.playAsync();
  } catch (error) {
    console.log(error);
  }
}

function setUpNotificationListeners() {
  Notifications.addNotificationReceivedListener(handleNotification);
  Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);
}

function handleNotification(notification) {
  playAdhanSound();
}

function handleNotificationResponse(response) {
  console.log(response);
}

export {
  registerForPushNotificationsAsync,
  schedulePushNotification,
  setUpNotificationListeners,
  playAdhanSound,
};
