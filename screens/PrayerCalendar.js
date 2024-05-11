import { StyleSheet, ScrollView, Text, View } from 'react-native'
import React, {useState, useEffect} from 'react'
import { fetchPrayerTimingsCalendar } from '../data/fetchData';
import { Picker } from '@react-native-picker/picker';
import { TouchableOpacity } from 'react-native-gesture-handler';

const PrayerCalendar = () => {
    const [calendarPrayerTimes, setCalendarPrayerTimes] = useState(null);
    const [location, setLocation] = useState("Oslo")
    const [year, setYear] = useState("2024");
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [showPicker, setShowPicker] = useState(false);

    const monthNames = [
        "Januar", "Februar", "Mars", 
        "April", "Mai", "Juni", 
        "Juli", "August", "September", 
        "Oktober", "November", "Desember"
    ];

    useEffect(() => {
        fetchPrayerTimingsCalendar(year, month, location).then(data => 
            setCalendarPrayerTimes(data));
    }, [location, month, year])

    // if (calendarPrayerTimes){
    //     console.log(calendarPrayerTimes.map((day, index) => day.date))
    // }


    return (
        <ScrollView>

            <View style={styles.pickerContainer}>
                <Picker selectedValue={year} 
                    onValueChange={(itemValue, itemIndex) => setYear(itemValue)}
                    style={styles.pickerStyle}>

                    <Picker.Item label="2021" value="2021" />
                    <Picker.Item label="2022" value="2022" />
                    <Picker.Item label="2023" value="2023" />
                    <Picker.Item label="2024" value="2024" />
                    <Picker.Item label="2025" value="2025" />
                    <Picker.Item label="2026" value="2026" />
                </Picker>

                <Picker
                    selectedValue={month}
                    onValueChange={(itemValue, itemIndex) => setMonth(itemValue)}
                    style={styles.pickerStyle}>
                    
                    {monthNames.map((name, index) => (
                        <Picker.Item key={index} label={name} value={String(index + 1)} />
                    ))}
                </Picker>
            </View>
            

            <View style={styles.calendarContainer}>
                <View style={styles.row}>
                    <Text>Dag</Text>
                    <Text>Fajr</Text>
                    <Text>Dhuhr</Text>
                    <Text>Asr</Text>
                    <Text>Maghrib</Text>
                    <Text>Isha</Text>
                </View>
                
                {calendarPrayerTimes ? (
                    calendarPrayerTimes.map((day, index) => (    
                        <View key={index} style={styles.row}>
                            <Text>{day.date}</Text>
                            <Text>{day.timings.Fajr}</Text>
                            <Text>{day.timings.Dhuhr}</Text>
                            <Text>{day.timings.Asr}</Text>
                            <Text>{day.timings.Maghrib}</Text>
                            <Text>{day.timings.Isha}</Text>
                        </View>
                    ))
                ) : null}
            </View>
            
        </ScrollView>
    )
}

export default PrayerCalendar

const styles = StyleSheet.create({
    calendarContainer: {
        width: "95%",
        padding: 10,
        // margin: 8,
        backgroundColor: 'white',
        alignSelf: "center",        
        // Legger til skygge for iOS
        shadowColor: '#000',
        margin: 10,
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
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        textAlign: "center",
        padding: 10,
        borderBottomWidth: .3,

    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#f9f9f9',
        height: 200,
    },
    pickerStyle: {
        width: "30%"
    },
})