import {StyleSheet, Text, View, ScrollView, ImageBackground, TouchableOpacity, Button } from 'react-native'
import React from 'react'
import HomeHeader from '../components/HomeHeader'
import { useState, useEffect } from 'react'
import { fetchTimesByDate,getNextPrayer, getCurrentPrayer } from '../data/fetchData'
import bckg from "../assets/dashboard_background.jpg"
import PrayerCard from '../components/PrayerCard'
import CitySelectorModal from '../components/CitySelectorModal'
import { Ionicons } from '@expo/vector-icons';
import {useStoredLocation} from '../data/storedData'
import {LoadingCircle} from '../components/LoadingCircle';
import {registerForPushNotificationsAsync,schedulePushNotification,setUpNotificationListeners,} from '../notifications.js';
import { registerBackgroundFetchAsync, unregisterBackgroundFetchAsync } from '../backgroundFetch.js'
import * as Notifications from 'expo-notifications';
  

const Home = ({ navigation }) => {
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [date, setDate] = useState(new Date());
    
    const {location, setLocation, calculationMethodId} = useStoredLocation();
    const [modalVisible, setModalVisible] = useState(false)
    const [nextPrayer, setNextPrayer] = useState("");
    const [timeUntilNextPrayer, setTimeUntilNextPrayer] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [currentPrayer, setCurrentPrayer] = useState("");

    const desiredPrayers = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

    
    // useEffect(() => {
    //     registerForPushNotificationsAsync().then(token => {
    //       if (token) {
    //         Alert.alert("Push Notification Token", token);
    //       }
    //     });
    //     setUpNotificationListeners();
        
    //     if (prayerTimes){
    //         registerBackgroundFetchAsync(prayerTimes.timings);
    //         schedulePushNotification(prayerTimes.timings);
    
    //         const subscription = Notifications.addNotificationReceivedListener(() => {
    //         // Når en varsling mottas, planlegg neste bønn
    //             schedulePushNotification(prayerTimes.timings);
    //         });
    //     }

    //     return () => {
    //         unregisterBackgroundFetchAsync();
    //         subscription.remove();
    //     };
    // }, []);


    
    
    useEffect(() => {
        fetchTimesByDate(date, location, calculationMethodId).then(data => 
            setPrayerTimes(data.data));
    }, [date, location, calculationMethodId])

    

    useEffect(() => {
        if(prayerTimes){
            const filteredPrayerTimes = Object.entries(prayerTimes.timings)
                .filter(([key, _]) => desiredPrayers.includes(key))
                .reduce((obj, [key, value]) => {
                    obj[key] = value;
                    return obj;
            }, {});
            
            setCurrentPrayer(getCurrentPrayer(filteredPrayerTimes))
            
            const timer = setInterval(() => {
                const { nextPrayer, timeUntilNextPrayer } = getNextPrayer(filteredPrayerTimes);
                setNextPrayer(nextPrayer);
                setTimeUntilNextPrayer(timeUntilNextPrayer);
            }, 1000);  // Oppdater hver sekund
            
            return () => clearInterval(timer);
        }
    }, [prayerTimes])


    const handleCitySelect = (city) => {
        setLocation(city)
        setModalVisible(false)
    }

    if (prayerTimes === null){
        return <LoadingCircle />
    }

    const handlePress = (prayerTimes) => {
        schedulePushNotification(prayerTimes)
    }

  
    return (
        <ScrollView>
            <View style={styles.home}>
                <ImageBackground source={bckg} style={styles.background}>
                    <View style={styles.topRow}>
                        <View style={styles.locationContainer}>
                            <TouchableOpacity onPress={() => setModalVisible(true)} style={{flexDirection: "row", alignItems: "center"}}>
                                <Ionicons name="location" size={28} color="white" />
                                <Text style={{fontSize: 24, color: "#fff", fontWeight: "bold"}}>{location}</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity onPress={() => navigation.navigate('Calendar')}>
                                <Ionicons name="calendar" size={28} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <HomeHeader date={date} setDate={setDate} />
                </ImageBackground>

            </View>
            
            


            <View style={styles.modalContainer}>
                <CitySelectorModal visible={modalVisible} onClose={() => setModalVisible(false)} onSelectCity={handleCitySelect}/>
            </View>
            
            
            {prayerTimes ? (
                <View style={styles.prayerTimes}>
                    <View>
                        <Text style={styles.nextPrayerStyle}>{nextPrayer} Starter om: {'\n'}
                            {timeUntilNextPrayer.hours ? timeUntilNextPrayer.hours + 't ' : null}
                            {timeUntilNextPrayer.minutes ? timeUntilNextPrayer.minutes + 'm ' : null}
                            {timeUntilNextPrayer.seconds}s
                        </Text>
                    </View>
                    {Object.entries(prayerTimes.timings)
                        .filter(([prayer, _]) => desiredPrayers.includes(prayer))
                        .map((prayer, index) => (
                            <PrayerCard prayer={prayer} key={index} nextPrayer={nextPrayer} currentPrayer={currentPrayer} isNextDay={date.getDate() === new Date().getDate() ? false : true}/>
                    ))}
                </View>
            ): (
                null
            )}
            {/* <Button title="Press" onPress={() => handlePress(prayerTimes.timings)}/> */}
            
        </ScrollView>
    );
}

export default Home

const styles = StyleSheet.create({
    
    home: {
        paddingTop: 0,
        flexDirection: "column",
        height: 290,
    },

    topRow: {
        flexDirection: "row",
        width: "100%",
        position: "absolute",
        alignItems: "center",
        top: 30,
        left: 0,
        padding: 20,
    },

    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%"
    },

    modalContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },

    nextPrayerStyle: {
        textAlign: "center",
        margin: 10,
        fontWeight: "bold",
        fontSize: 20,
    },

    prayerTimes: {
        alignItems: "center"
    },
    
    background: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
        height: 200,
    },
})