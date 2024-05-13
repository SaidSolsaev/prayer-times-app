import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { surah } from '../data/surah'

const QuranScreen = ({navigation}) => {

  

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.column}>
            {Object.entries(surah).map(([number, {name, arabic}]) => (
              <TouchableOpacity key={number} style={styles.row} onPress={()=> navigation.navigate("Surah", {surahNum: number, surahName: name})}>
                  <Text style={styles.surahText}>{number}: {name}</Text>
                  <Text style={styles.surahText}>{arabic}</Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>
    </ScrollView>

  )
}

export default QuranScreen

const styles = StyleSheet.create({
  container:{
    backgroundColor: "#fff"
  },
  column: {
    marginBottom: 20,
    flexDirection: "column",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
    padding: 20
  },

  surahText: {
    fontSize: 18,
    fontWeight: "bold"
  }
})