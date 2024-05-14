import { Dimensions, ScrollView, StyleSheet, Text, View, } from 'react-native'
import React from 'react'
import { namesOfAllah } from '../data/namesOfAllah'
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get("window").width;

const AllahNamesScreen = () => {
    return (
        <ScrollView>
            <View style={styles.container}>

                <View style={styles.card}>
                    <Ionicons name="information-circle" size={18} color="#aaa" style={{position: "absolute", left: 2, top: 5}}/>
                    
                    <Text>
                        {"\n"}
                        Troen på Allah, som er grunnlaget for imaan i Islam, 
                        bygger på kunnskap om Hans vakre navn og attributter, åpenbart i Koranen. 
                        Å kjenne disse navnene er nøkkelen til å forstå og riktig tilbe Allah
                    </Text>
                    <Text>
                        {"\n"}Allah sier i Koranen:{"\n"}
                        Og for Allah tilhører de beste navn, så påkall Ham ved dem.. (Koranen 7:180){"\n"}
                        {"\n"}
                        Profeten Muhammad(ﷺ) sa, “Allah har nittini navn, dvs. ett hundre minus én, og den som kjenner dem vil gå til Paradis.”
                        (Sahih Bukhari 54:23){"\n"}

                    </Text>
                </View>

            </View>

            
            <View style={styles.tableHeader}>
                <Text style={[styles.tableHeader, { width: screenWidth * 0.1 }]}>#</Text>
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
    container: {
        alignItems: "center",
    },
   
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: 'green',
        textAlign: "center",
        paddingVertical: 10
    },

    card: {
        backgroundColor: '#fff',
        width: '90%',
        padding: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 20,
        marginTop: 20,
        alignItems: 'flex-start'
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