import { StyleSheet, Text, View, Dimensions} from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Location from "expo-location";
import { fetchMosques } from '../data/fetchData';
import {LoadingCircle} from "../components/LoadingCircle.js";
import {WebView} from 'react-native-webview';

const FindMosque = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [mosques, setMosques] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLocationAndMosques = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                setLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);

            const data = await fetchMosques(location.coords.latitude, location.coords.longitude);
            setMosques(data);
            setLoading(false);
        };

        loadLocationAndMosques();
        
    },[])

    // console.log(mosques)


    if (loading) {
        return (
            <LoadingCircle />
        );
    }

    if (errorMsg){
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
        )
    }

    const mapHtml = `
        <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
                <style>
                    #map { height: 100vh; width: 100%; }
                </style>
            </head>
            
            <body>
                <div id="map"></div>
                <script>
                    var map = L.map('map').setView([${location.coords.latitude}, ${location.coords.longitude}], 14);

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(map);

                    var userMarker = L.marker([${location.coords.latitude}, ${location.coords.longitude}]).addTo(map)
                    .bindPopup('Du er her').openPopup();

                    var mosques = ${JSON.stringify(mosques)};
                    mosques.forEach(function(mosque) {
                        L.marker([mosque.latitude, mosque.longitude]).addTo(map)
                            .bindPopup('<b>' + mosque.title + '</b><br>' + mosque.city + ', ' + mosque.address + 
                            '<br>Retning: ' + mosque.denomination + '<br>Telefon: ' + mosque.phone_number +
                            '<br>Distanse fra din lokasjon: ' + mosque.distance + 'km'
                        );
                    });
                </script>
            </body>
        </html>
    `;
    
    return (
        <WebView
            originWhitelist={['*']}
            source={{ html: mapHtml }}
            style={styles.webView}
        />
    )
}

export default FindMosque

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    webView: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    },
});