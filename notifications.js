import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import { DateTime } from 'luxon';
import { getNextPrayer } from './utils/prayerFunctions';

const projectId = '1689b72f-1a9b-4d7a-898b-7f2c93fbcf0f';

async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
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

    const token = (await Notifications.getExpoPushTokenAsync({projectId})).data;
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



const schedulePushNotification = async(prayerTimes) => {
  const nextPrayer = getNextPrayer(prayerTimes);
  const dateTime = new Date(nextPrayer.time);

  console.log(`Scheduling notification for ${nextPrayer.name} at ${dateTime}`);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `It's time for ${nextPrayer.name}!`,
      body: `Time to perform your ${nextPrayer.name} prayer.`,
      sound: 'default',
    },
    trigger: { date:  dateTime},
  });
  
}

async function playAdhanSound() {
  const soundObject = new Audio.Sound();
  try {
    await soundObject.loadAsync(require('./assets/sound/adhan.mp3'));
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
