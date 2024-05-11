import { StyleSheet, Text, View, Image} from 'react-native'
import React, {useState, useEffect} from 'react'
import { fetchQiblaDirection } from '../data/fetchData'
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import LoadingSircle from '../components/LoadingSircle';

const QbilaScreen = () => {
    const [lat, setLat] = useState(null)
    const [lon, setLon] = useState(null)
    const [direction, setDirection] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)
    const [magnetometerData, setMagnetometerData] = useState({ x: 0, y: 0, z: 0 });

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

        const subscription = Magnetometer.addListener(data => {
            setMagnetometerData(data);
        });

        return () => subscription.remove();
    }, [])

    useEffect(() => {
        if (lat != null && lon != null){
            fetchQiblaDirection(lat, lon).then(data => 
                setDirection(data.data.direction)
            );
            
        }
    }, [lat, lon])

    const calculateAngle = () => {
        const { x, y } = magnetometerData;
        const angle = Math.atan2(y, x);
        return angle + Math.PI / 2; // Adjust the angle by 90 degrees
    };

    const angleToQibla = direction ? calculateAngle() - (direction * Math.PI / 180) : 0;

    if (errorMsg){
        return <Text>{errorMsg}</Text>
    }

    if (angleToQibla === 0){
        return <LoadingSircle />
    }

    
    return (
        <View style={styles.container}>
            <View style={{transform: [{ rotate: `${angleToQibla}rad` }]}}>
                <Image source={require('../assets/compass.png')} style={styles.compass} />
                {/* <Image source={require('../assets/kaaba.png')} style={styles.kaaba} /> */}
            </View>
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