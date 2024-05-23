import { StyleSheet, Text, View, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import * as Location from "expo-location";
import { fetchMosques } from '../data/fetchData';
import {LoadingCircle} from "../components/LoadingCircle.js";
import {WebView} from 'react-native-webview';
import BottomSheet from '@gorhom/bottom-sheet';
import { FlatList } from 'react-native-gesture-handler';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

const FindMosque = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [mosques, setMosques] = useState([]);
    const [loading, setLoading] = useState(true);


    // Ref for BottomSheet
    const sheetRef = useRef(null);

    // Snap points for BottomSheet
    const snapPoints = useMemo(() => ['8%', '50%'], []);

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
                    #map { height: 100vh; width: 100%;}
                </style>
            </head>
            
            <body>
                <div id="map"></div>
                <script>
                    var map = L.map('map').setView([${location.coords.latitude}, ${location.coords.longitude}], 12);

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(map);

                    var userIcon = L.icon({
                        iconUrl: 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png',
                        iconSize: [22, 22], // size of the icon
                        iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
                        popupAnchor: [-4, -32] // point from which the popup should open relative to the iconAnchor
                    });

                    var mosqueIcon = L.icon({
                        iconUrl: 'https://cdn-icons-png.flaticon.com/512/7158/7158433.png',
                        iconSize: [40, 40],
                        iconAnchor: [16, 32],
                        popupAnchor: [0, -32]
                    });

                    var userMarker = L.marker([${location.coords.latitude}, ${location.coords.longitude}], {icon: userIcon}).addTo(map)
                    .bindPopup('Du er her').openPopup();

                    var mosques = ${JSON.stringify(mosques)};
                    mosques.forEach(function(mosque) {
                        L.marker([mosque.latitude, mosque.longitude], {icon: mosqueIcon}).addTo(map)
                            .bindPopup('<b>' + mosque.title + '</b><br>' + mosque.city + ', ' + mosque.address + 
                            '<br>Retning: ' + mosque.denomination + '<br>Telefon: ' + mosque.phone_number +
                            '<br>Distanse fra din lokasjon: ' + mosque.distance + 'km'
                        );
                    });

                    map.removeControl(map.zoomControl);
                </script>
            </body>
        </html>
    `;

    const openMaps = (lat, lng) => {
        const url = Platform.select({
            ios: `maps:0,0?q=${lat},${lng}`,
            android: `geo:0,0?q=${lat},${lng}`
        });

        Linking.openURL(url);
    }

    const openCall = (number) => {
        Alert.alert(
            "Ring",
            `Vil du ringe ${number}?`,
            [
                {
                    text: "Avbryt",
                    style: "cancel"
                },
                {
                    text: "Ring",
                    onPress: () => Linking.openURL(`tel:${number}`)
                }
            ]
        );
    }

    const renderMosqueItem = ({ item }) => (
        <View style={styles.mosqueItem}>
            <View style={styles.mosqueInfoContainer}>
                <Text style={styles.mosqueTitle}>{item.title}</Text>
                <Text>{item.address}, {item.city}</Text>
                <Text>{item.phone_number}</Text>
                <Text>{item.distance} km</Text>
            </View>

            <View style={styles.mosqueButtons}>
                <TouchableOpacity onPress={() => openMaps(item.latitude, item.longitude)}>
                    <FontAwesome5 name="directions" size={22} color="green" style={{marginBottom: 10}}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => openCall(item.phone_number)}>
                    <Ionicons name="call-sharp" size={22} color="green" />
                </TouchableOpacity>
            </View>
        </View>
    );
    
    return (
        <View style={styles.container}>
            <WebView
                originWhitelist={['*']}
                source={{ html: mapHtml }}
                style={styles.webView}
            />

            <BottomSheet ref={sheetRef} index={0} snapPoints={snapPoints} handleComponent={null}>
                <View style={styles.bottomSheetHeader}>
                    <Text style={styles.headerText}>Moskeer i nærheten</Text>
                </View>
                <View style={styles.contentContainer}>
                    <FlatList 
                        data={mosques}
                        key={(item) => item.id.toString()}
                        renderItem={renderMosqueItem}
                    />
                </View>
            </BottomSheet>
        </View>
    )
}

export default FindMosque

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    webView: {
        width: "100%",
        height: "100%",
    },

    errorText: {
        fontSize: 18,
        color: 'red',
    },

    bottomSheetHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        backgroundColor: '#f7f7f7',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },

    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    contentContainer: {
        flex: 1,
    },

    mosqueItem: {
        maxWidth: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },

    mosqueTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    mosqueButtons: {
        marginTop: 8,
    }
});