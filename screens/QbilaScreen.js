import { StyleSheet, Text, View, Image} from 'react-native'
import React, {useState, useEffect} from 'react'
import { fetchQiblaDirection } from '../data/fetchData'
import * as Location from 'expo-location';
import LoadingSircle from '../components/LoadingSircle';
import QiblaCompass from '../QiblaCompass/QiblaCompass';

const QbilaScreen = () => {
    const [lat, setLat] = useState(null)
    const [lon, setLon] = useState(null)
    const [direction, setDirection] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)


    useEffect(() => {
        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted"){
                setErrorMsg("Permission to access location was denied")
                return;
            }

            const location = await Location.getCurrentPositionAsync();
            setLat(location.coords.latitude)
            setLon(location.coords.longitude)
        })();

        

    }, [])

    useEffect(() => {
        if (lat != null && lon != null){
            fetchQiblaDirection(lat, lon).then(data => 
                setDirection(data.data.direction)
            );
            
        }
    }, [lat, lon])

    

    if (errorMsg){
        return <Text>{errorMsg}</Text>
    }

    
    return (
        <View style={styles.container}>
            <QiblaCompass
                compassImage={require('../assets/compass.png')}
                kaabaImage={require('../assets/kaaba.png')}/>
        </View>
    )
}

export default QbilaScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    compass: {
        width: 300,
        height: 300,
    },
    kaaba: {
        width: 50,
        height: 50,
        position: 'absolute',
        top: 0,  // Center the Kaaba image over the compass
        left: '50%',
        marginLeft: -25,  // Adjust these to position the Kaaba image exactly over the center or desired location
        marginTop: -25,
    }
})