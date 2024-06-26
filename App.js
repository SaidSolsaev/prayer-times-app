import Routes from './Routes';
import {NavigationContainer} from '@react-navigation/native';
import { LocationProvider } from './data/storedData';
import React from 'react';


export default function App() {
  return (
    <LocationProvider>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </LocationProvider>
  );
}
