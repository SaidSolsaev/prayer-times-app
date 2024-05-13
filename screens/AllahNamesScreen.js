import { Dimensions, ScrollView, StyleSheet, Text, View, } from 'react-native'
import React from 'react'
import { namesOfAllah } from '../data/namesOfAllah'


const screenWidth = Dimensions.get("window").width;

const AllahNamesScreen = () => {
    return (
        <ScrollView>
            {/* <Text>
                Det første prinsippet for imaan i Islam er troen på Allah. 
                Som muslimer tror vi på Allah i henhold til Hans vakre navn og attributter. 
                Allah har gjentatte ganger avslørt sine navn i den hellige Koranen, primært for at vi skal forstå hvem Han er. 
                Å lære og huske Allahs navn vil hjelpe oss til å identifisere den korrekte måten å tro på Ham. 
                Det finnes ingenting mer hellig og velsignet enn å forstå navnene til Allah og leve etter dem. 
                Hvordan kan vi forvente å tilbe, elske, frykte og stole på vår Herre, 
                Den Allmektige Allah, hvis vi ikke vet hvem Han er?
            </Text>

            <Text>
                Allah sier i Koranen:{"\n"}
                Og for Allah tilhører de beste navn, så påkall Ham ved dem.. (Koranen 7:180){"\n"}

                Allah – det er ingen gud utenom Ham. Til Ham tilhører de beste navn. (Koranen 20:8){"\n"}

                Han er Allah, Skaperen, Oppfinneren, Formeren; til Ham tilhører de beste navn. (Koranen 59:24){"\n"}

                Profeten Muhammad(ﷺ) sa, “Allah har nittini navn, dvs. ett hundre minus én, og den som kjenner dem vil gå til Paradis.”
                (Sahih Bukhari 54:23){"\n"}

                Abu Huraira rapporterte Allahs Budbringer(ﷺ) som sa: Det er nittini navn til Allah; den som lærer dem utenat, vil komme til Paradis. Sannelig, Allah er Ulik (Han er én, og det er et oddetall) og Han elsker oddetall..”
                (Sahih Muslim Bok-48 Hadith-5){"\n"}
            </Text> */}

            
            <View style={styles.tableHeader}>
                <Text style={[styles.tableHeader, { width: screenWidth * 0.1 }]}>1</Text>
                <Text style={[styles.tableHeader, { width: screenWidth * 0.2 }]}>Name</Text>
                <Text style={[styles.tableHeader, { width: screenWidth * 0.3 }]}>Transliteration</Text>
                <Text style={[styles.tableHeader, { width: screenWidth * 0.4}]}>Meaning</Text>
            </View>
            {Object.entries(namesOfAllah).map(([key, { name, transliteration, meaning }], index) => (
                <View key={index} style={styles.tableRow}>
                    <Text style={[styles.cell, { width: screenWidth * 0.1}]}>{key}</Text>
                    <Text style={[styles.cell, styles.bold, { width: screenWidth * 0.2 }]}>{name}</Text>
                    <Text style={[styles.cell, { width: screenWidth * 0.3 }]}>{transliteration}</Text>
                    <Text style={[styles.cell, { width: screenWidth * 0.4 }]}>{meaning}</Text>
                </View>
            ))}
        </ScrollView>
    )
}

export default AllahNamesScreen

const styles = StyleSheet.create({
   
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: 'green',
        textAlign: "center",
        paddingVertical: 10
    },

    tableRow: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: "center",
        width: "100%",
        borderBottomWidth: 1,
        paddingVertical: 10,
    },
    cell: {
        textAlign: "center",
    },

    bold: {
        fontWeight: 'bold',
    }
})