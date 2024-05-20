import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, {useState} from 'react'
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

const PrayerCard = ({prayer, nextPrayer, currentPrayer}) => {
    const [notifaction, setNotification] = useState(true)

    function changeNotification(){
        setNotification(!notifaction)
    }

    // console.log(prayer)

    const isPastPrayer = prayer[0] !== currentPrayer 
        && new Date().getTime() - new Date().setHours(...prayer[1].split(':').map(Number), 0, 0) > 0;

        
    function getIcon(prayer){
        if (prayer === "Sunrise"){
            return <Feather name="sunrise" size={24} color="orange" style={{marginRight: 5}}/>
        } else if(prayer === "Maghrib"){
            return <Feather name="sunset" size={24} color="orange" style={{marginRight: 5}}/>
        }
    }
    return (
        <View style={[styles.card, prayer[0] == currentPrayer && styles.activeCard, isPastPrayer && styles.pastPrayer]} >
            <View style={{flex: .5,flexDirection: "row", alignItems: "center"}}>
                {getIcon(prayer[0])}
                <Text>{prayer[0]}</Text>
            </View>
            <Text style={styles.prayerTime}>{prayer[1]}</Text>
            <TouchableOpacity onPress={() => changeNotification()} style={styles.icon}>
                {notifaction ? <Ionicons name="notifications" size={24} color="green" /> : <Ionicons name="notifications-off" size={24} color="red" />}
            </TouchableOpacity>
        </View>
    )
}

export default PrayerCard

const styles = StyleSheet.create({
    card: {
        width: "90%",
        flexDirection: "row",
        padding: 20,
        margin: 8,
        backgroundColor: 'white',
        justifyContent: 'space-between',
        alignItems: 'center', 
        
        // Add shadow for iOS
        shadowColor: '#000',
        borderRadius: 8,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        // Add shadow for Android
        elevation: 5,
    },
    activeCard: {
        backgroundColor: '#EEEDB0',
    },
    pastPrayer: {
        backgroundColor: '#A9A9A9',
        color: "red",
    },

    prayerTime: {
        flex: 2,
        textAlign: "center"
    },

    icon:{
        textAlign: "right"
    }
})