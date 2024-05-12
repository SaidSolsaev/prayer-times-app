import { StyleSheet, Text, View } from 'react-native'
import React, {useState, useEffect} from 'react'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { getHijriDate } from '../data/fetchData';

const HijriCalendar = () => {
  const date = new Date()
  const today = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
  const [selected, setSelected] = useState(today);
  const [hijriDate, setHijriDate] = useState("")


  useEffect(() => {
    getHijriDate(new Date(selected)).then(data => 
      setHijriDate(`${data.data.hijri.day} ${data.data.hijri.month.en} ${data.data.hijri.year}`));
  }, [selected])


  LocaleConfig.locales['no'] = {
    monthNames: [
      'Januar',
      'Februar',
      'Mars',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Desember'
    ],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'],
    dayNames: ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'],
    dayNamesShort: ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'],
  }

  LocaleConfig.defaultLocale = 'no';

  return (
    <View style={styles.container}>
      <Calendar 
        onDayPress={day => {setSelected(day.dateString)}}
        markedDates={{
          [selected] : {selected: true, disableTouchEvent: true}
        }}
        style={styles.calendar}
        enableSwipeMonths={true}
        theme={{
          textMonthFontSize: 26,
          monthTextColor: 'green',
          arrowColor: 'green',
          selectedDayBackgroundColor: 'green',
        }}
      />

      <Text style={styles.hijriDate}>{hijriDate}</Text>
      
    </View>
  )
}

export default HijriCalendar

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center"
  },
  calendar: {
    margin: 20,
    padding: 40,
    height: 350,
    width: 350
  },

  hijriDate: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 50
  }
  
})