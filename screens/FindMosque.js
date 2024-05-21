import { StyleSheet, Text, View, Dimensions} from 'react-native';
import React, { useEffect, useState } from 'react';
import Mapbox from '@rnmapbox/maps';
import { MAPBOX_API_KEY } from '../env';
import * as Location from "expo-location";
import { fetchMosques } from '../data/fetchData';

// MapboxGL.setAccessToken(MAPBOX_API_KEY);

const FindMosque = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [mosques, setMosques] = useState([]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            
            if (status !== 'granted') {
              setErrorMsg('Permission to access location was denied');
              return;
            }
      
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            const data = fetchMosques(location.coords.latitude, location.coords.longitude);
            setMosques(data);
        })();
    },[])

    
    return (
        <View>
            <Text>FindMosque</Text>
        </View>
    )
}

export default FindMosque

const styles = StyleSheet.create({})