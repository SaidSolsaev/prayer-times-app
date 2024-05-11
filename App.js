import {StyleSheet} from 'react-native';
import Routes from './Routes';
import {NavigationContainer} from '@react-navigation/native';


export default function App() {
  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  
});
