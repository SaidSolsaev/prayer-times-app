
const PRAYER_TIME_CALENDAR_URL = "http://api.aladhan.com/v1/calendarByCity";
const PRAYER_TIME_BY_DATE_URL = "http://api.aladhan.com/v1/timingsByCity";
const HIJRI_CALENDAR_URL = "http://api.aladhan.com/v1/gToH"
const QIBLA_DIRECTION_URL = "http://api.aladhan.com/v1/qibla"
const QURAN_SURAH_URL = "http://api.alquran.cloud/v1/surah"
const QURAN_SURAH_RECITATION_URL = "https://api.quran.com/api/v4/chapter_recitations/7"
const country = "Norway";
const method = "3"




export const fetchTimesByDate = async (date, city) =>{
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    // Formater datoen til DD-MM-YYYY format
    const formattedDate = `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;

    try {
        const response = await fetch(`${PRAYER_TIME_BY_DATE_URL}/${formattedDate}?city=${city}&country=${country}&method=${method}`);
        const data = await response.json();
    
        if (!response.ok) {
          throw new Error(data.message || 'Unable to fetch data');
        }
        return data;

    } catch (error) {
        console.error('Error fetching prayer times:', error);
        return null;
    }
}

export const fetchQuranSurah = async(surahNum) => {
    try {
        const response = await fetch(`${QURAN_SURAH_URL}/${surahNum}`)
        const data = await response.json()

        if (!response.ok){
            throw new Error(data.message || "Unable to fetch quran data")
        }
        return data
    } catch (error) {
        console.log(`Error in fetching surah ${surahNum}`, error.message)
        return null
    }
}

export const fetchQuranSurahTranslation = async(surahNum) => {
    try {
        const response = await fetch(`${QURAN_SURAH_URL}/${surahNum}/en.asad`)
        const data = await response.json()

        if (!response.ok){
            throw new Error(data.message || "Unable to fetch quran data")
        }
        return data
    } catch (error) {
        console.log(`Error in fetching surah ${surahNum}`, error.message)
        return null
    }
}

export const fetchQuranSurahRecitation  = async(surahNum) => {
    
    try {
        const response = await fetch(`${QURAN_SURAH_RECITATION_URL}/${surahNum}.mp3`)
        const data = await response.json()

        if (!response.ok){
            throw new Error(data.message || "Unable to fetch quran data")
        }
        return data
    } catch (error) {
        console.log(`Error in fetching surah ${surahNum}`, error.message)
        return null
    }
}

export const fetchPrayerTimingsCalendar = async(year, month, city) => {
    try {
        const response = await fetch(`${PRAYER_TIME_CALENDAR_URL}/${year}/${month}?city=${city}&country=${country}&method=${method}`);
        const data = await response.json();
        const filteredTimes = data.data.map(day => {
            return {
                date: day.date.readable.split(" ")[0],
                timings: {
                    Fajr: day.timings.Fajr.replace(/\s*\([^)]*\)/g, ''),
                    Dhuhr: day.timings.Dhuhr.replace(/\s*\([^)]*\)/g, ''),
                    Asr: day.timings.Asr.replace(/\s*\([^)]*\)/g, ''),
                    Maghrib: day.timings.Maghrib.replace(/\s*\([^)]*\)/g, ''),
                    Isha: day.timings.Isha.replace(/\s*\([^)]*\)/g, ''),
                    Sunset: day.timings.Sunset.replace(/\s*\([^)]*\)/g, '')
                }
            };
        });
        return filteredTimes;
    } catch (error) {
        console.error('Error fetching calendar prayer times:', error);
        return null;
    }
}

export const getHijriDate = async(date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    // Formater datoen til DD-MM-YYYY format
    const formattedDate = `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;

    try {
        const response = await fetch(`${HIJRI_CALENDAR_URL}/${formattedDate}`);
        const data = await response.json();
    
        if (!response.ok) {
          throw new Error(data.message || 'Unable to fetch data');
        }
        return data;

    } catch (error) {
        console.error('Error fetching hijri calendar:', error);
        return null;
    }

}

export const fetchQiblaDirection = async (lat, lon) => {
    try {
        const response = await fetch(`${QIBLA_DIRECTION_URL}/${lat}/${lon}`);
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Unable to fetch data');
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching Qibla direction:', error);
    }
};

export const getNextPrayer = (prayerTimes) => {
    const now = new Date();
    const currHours = now.getHours();
    const currMin = now.getMinutes();
    const currSec = now.getSeconds();
    //console.log(prayerTimes)
    let nextPrayer = "";
    let smallestDiff = 24 * 60 * 60;  // Størst mulig differanse i sekunder

    for (const [prayer, time] of Object.entries(prayerTimes)) {
        const [hours, minutes] = time.split(":").map(Number);
        let diff = (hours - currHours) * 3600 + (minutes - currMin) * 60 - currSec;

        if (diff < 0) {
            diff += 24 * 3600;  // Justere for neste dag
        }

        if (diff < smallestDiff) {
            smallestDiff = diff;
            nextPrayer = prayer;
        }
    }

    const hours = Math.floor(smallestDiff / 3600);
    const minutes = Math.floor((smallestDiff % 3600) / 60);
    const seconds = smallestDiff % 60;

    return { nextPrayer, timeUntilNextPrayer: { hours, minutes, seconds } };
}

export const getCurrentPrayer = (prayerTimes) => {
    const now = new Date();
    const currHours = now.getHours();
    const currMin = now.getMinutes();
    
    let currPrayer = "";
    let smallestDiff = -24 * 60;


    for (const [prayer, time] of Object.entries(prayerTimes)) {
        const [hours, minutes] = time.split(":").map(Number);
        let diff = (hours - currHours) * 60 + (minutes - currMin);

        if (diff > 0){
            continue;
        }

        if (diff > smallestDiff){
            smallestDiff = diff;
            currPrayer = prayer;
        }
    }

    return currPrayer;
}