import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchQuranSurah } from '../data/fetchData'
import LoadingSircle from './LoadingSircle';

const SurahScreen = ({route}) => {
    const {surahNum} = route.params;
    const [surah, setSurah] = useState(null)

    useEffect(() => {
        fetchQuranSurah(surahNum).then(data => 
            setSurah(data.data.ayahs));
    }, [surahNum]);


    if (!surah){
        return <LoadingSircle />
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.column}>
                    {surah.map((surah, index) => (
                        <View style={styles.row} key={index}>
                            <Text style={styles.text}>{surah.text}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    )
}

export default SurahScreen

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#fff",
        flex: 1,
        width: "100%"
    },

    column: {
        width: "100%",
        flexDirection: "column",
    },
  
    row: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingTop: 30,
        textAlign: 'center'
    },


    text: {
        fontSize: 32,
        height: "100%",
        fontWeight: "bold",
        textAlign: "center",
        marginTop: "auto",
        marginBottom: "auto",
    }
})