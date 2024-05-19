import {StyleSheet} from 'react-native';
import Routes from './Routes';
import {NavigationContainer} from '@react-navigation/native';
import { LocationProvider } from './data/storedData';
import React, {useEffect} from 'react';

import {
  registerForPushNotificationsAsync,
  schedulePushNotification,
  setUpNotificationListeners,
} from './notifications.js';

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        Alert.alert("Push Notification Token", token);
      }
    });
    setUpNotificationListeners();

    return () => {
      // Clean up listeners if necessary
    };
  }, []);

  return (
    <LocationProvider>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </LocationProvider>
  );
}

const styles = StyleSheet.create({
  
});
