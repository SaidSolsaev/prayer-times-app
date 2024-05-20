import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { DateTime } from 'luxon';


export const getNextPrayer = (prayerTimes) => {
    const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const now = DateTime.local();
    let nextPrayer = null;
  
    for (let prayerName of prayerNames) {
      const prayerTime = DateTime.fromISO(prayerTimes[prayerName]);
      if (prayerTime > now) {
        nextPrayer = { name: prayerName, time: prayerTime };
        break;
      }
    }
  
    // If all today's prayers are over, return the first prayer of the next day
    if (!nextPrayer) {
      const firstPrayerTime = DateTime.fromISO(prayerTimes['Fajr']).plus({ days: 1 });
      nextPrayer = { name: 'Fajr', time: firstPrayerTime };
    }
  
    return nextPrayer;
}

