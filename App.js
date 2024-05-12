import {StyleSheet} from 'react-native';
import Routes from './Routes';
import {NavigationContainer} from '@react-navigation/native';
import { LocationProvider } from './data/storedData';


export default function App() {
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
