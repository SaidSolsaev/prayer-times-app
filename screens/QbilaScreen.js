import { StyleSheet, Text, View} from 'react-native'
import React, {useState, useEffect} from 'react'
import { fetchQiblaDirection } from '../data/fetchData'
import * as Location from 'expo-location';
//import QiblaCompass from 'react-native-qibla-compass';

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
            {/* <QiblaCompass 
                kaabaImage={require("../assets/kaaba.png")} 
                textStyles={{ textAlign: "center", fontSize: 24 }}
            /> */}
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
})