import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, {useState, useEffect} from 'react'
import { AntDesign } from '@expo/vector-icons';
import { getHijriDate } from '../data/fetchData';


const HomeHeader = ({date, setDate}) => {
    const dayName = new Intl.DateTimeFormat('no-NB', {weekday: 'long'}).format(date);
    const dateForamated = new Intl.DateTimeFormat('no-NB', {year: 'numeric', month:'long', day: 'numeric'}).format(date);
    const [hijriDate, setHijriDate] = useState(null);
    

    function changeDate(isNext){
        const newDate = new Date(date);

        isNext ? newDate.setDate(newDate.getDate()+1) : newDate.setDate(newDate.getDate()-1)

        setDate(newDate)
    }

    useEffect(() => {
        getHijriDate(date).then(data => 
            setHijriDate(data.data));
    }, [date])

    
    if(!hijriDate){
        return <Text>Loading...</Text>
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => changeDate(false)}>
                <AntDesign name="leftcircleo" size={24} color="black" />
            </TouchableOpacity>
            
            <View style={styles.textColumn}>
                <Text style={{fontWeight: "bold", fontSize: 22}}>{dateForamated}</Text>
                <Text style={{fontSize: 16}}>{hijriDate.hijri.date}</Text>
            </View>
        
            <TouchableOpacity onPress={() => changeDate(true)}>
                <AntDesign name="rightcircleo" size={24} color="black" />
            </TouchableOpacity>
        </View>
    )
}

export default HomeHeader

const styles = StyleSheet.create({
    container: {
        width: "75%",
        flexDirection: "row",
        height: 130,
        padding: 20,
        position: "absolute",
        top: 150,
        backgroundColor: 'white', // Sett bakgrunnsfargen til hvit
        justifyContent: 'space-between', // Vertikalt sentrer tekst
        alignItems: 'center', // Horisontalt sentrer tekst
        // Legger til skygge for iOS
        shadowColor: '#000',
        borderRadius: 8,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        // Legger til skygge for Android
        elevation: 5,
    },

    textColumn:{
        alignItems: "center",
        justifyContent: "center"
    }
})