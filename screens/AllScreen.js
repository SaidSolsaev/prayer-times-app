import { StyleSheet, Share, View, Image, } from 'react-native'
import React from 'react'
import BoxContainer from '../components/BoxContainer'
import { Ionicons } from '@expo/vector-icons';
import CitySelectorModal from '../components/CitySelectorModal';
import { useState } from 'react';
import {useStoredLocation} from '../data/storedData';

const AllScreen = ({navigation}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { location, setLocation } = useStoredLocation();


    function getIcons(title){
        switch(title){
            case "Velg by":
                return <Ionicons name='location' size={52} color="black" style={{alignSelf: "center"}}/>;
            case "Allah's 99 navn":
                return <Image source={require("./../assets/allah.png")} style={{width: 70, height: 50, alignSelf: "center"}}/>;
            case "Om appen":
                return <Ionicons name="information-circle" size={52} color="black" style={{alignSelf: "center"}}/>
            case "Innstillinger":
                return <Image source={require("./../assets/setting.png")} style={{width: 50, height: 50, alignSelf: "center"}}/>;
            case "Koran" :
                return <Image source={require("./../assets/quran.png")} style={{width: 50, height: 50, alignSelf: "center"}}/>;
            case "Hijrikalender":
                return <Image source={require("./../assets/calendar.png")} style={{width: 50, height: 50, alignSelf: "center"}}/>;
            case "Admin":
                return <Image source={require("./../assets/user.png")} style={{width: 50, height: 50, alignSelf: "center"}}/>;
            case "Del appen":
                return <Ionicons name='share-social' size={52} color="black" style={{alignSelf: "center"}}/>;;
            default:
                return null;
        }
    }

    const shareApp = async () => {
        try {
            const result = await Share.share({
                message: 'Sjekk ut denne flotte appen: https://example.com/app-link',
                url: 'https://example.com/app-link',
                title: 'Del Appen'
            });

            if (result.action === Share.sharedAction){
                if (result.activityType){
                    console.log("Delt appen med aktivitetstype")
                } else{
                    console.log("Delt appen")
                }
            } else if(result.action === Share.dismissedAction){
                console.log("Avbrutt delingen")
            }
        } catch (error) {
            console.error(error.message)
        }
    }

    const handleCitySelect = (city) => {
        setLocation(city)
        setModalVisible(false)
    }

    return ( 

        <View style={styles.container}>
            <CitySelectorModal visible={modalVisible} onClose={() => setModalVisible(false)} onSelectCity={handleCitySelect}/>
            
            <View style={styles.column}>
                <View style={styles.row}>
                    <BoxContainer title="Velg by" icon={getIcons("Velg by")} onPress={() => setModalVisible(!modalVisible)}/>
                    <BoxContainer title="Om appen" icon={getIcons("Om appen")} onPress={() => navigation.navigate('Info')}/>

                </View>
                
                <View style={styles.row}>
                    <BoxContainer title="Allah's 99 navn" icon={getIcons("Allah's 99 navn")} onPress={() => navigation.navigate('AllahsNames')}/>
                    <BoxContainer title="Innstillinger" icon={getIcons("Innstillinger")} onPress={() => navigation.navigate('Settings')}/>
                </View>

                <View style={styles.row}>
                    <BoxContainer title="Koran" icon={getIcons("Koran")} onPress={() => navigation.navigate('Quran')}/>
                    <BoxContainer title="Hijrikalender" icon={getIcons("Hijrikalender")} onPress={() => navigation.navigate('HijriCalendar')}/>
                </View>

                <View style={styles.row}>
                    <BoxContainer title="Admin" icon={getIcons("Admin")} onPress={() => navigation.navigate('Admin')}/>
                    <BoxContainer title="Del appen" icon={getIcons("Del appen")} onPress={() => shareApp()}/>
                </View>
            </View>
        </View>
    )
}

export default AllScreen

const styles = StyleSheet.create({
    container: {
        marginBottom: "auto",
        marginTop: "auto",
    },
    column: {
        flexDirection: "column",
        padding: 5,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
})