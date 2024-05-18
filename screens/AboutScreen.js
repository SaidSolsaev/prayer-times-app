import {View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'



const AboutScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>About Faithful Companion</Text>
      <Text style={styles.slogan}>Your Daily Guide to Faith</Text>
      
      <Text style={styles.sectionTitle}>Purpose</Text>
      <Text style={styles.text}>
        Faithful Companion is designed to provide accurate prayer times for Muslims around the world, along with additional features to enhance your spiritual journey.
      </Text>
      
      <Text style={styles.sectionTitle}>Features</Text>
      <Text style={styles.text}>
        - Accurate prayer times based on your location {"\n"}
        - Notification reminders for each prayer{"\n"}
        - Qibla direction to help you face Mecca{"\n"}
        - Islamic calendar with important dates{"\n"}
        - Customizable settings for prayer calculations{"\n"}
        - Read the Holy Quran with translation and tafsir{"\n"}
        - Learn and explore the 99 names of Allah with meanings and explanations
      </Text>

      <Text style={styles.sectionTitle}>Read the Quran</Text>
      <Text style={styles.text}>
        Access the complete text of the Holy Quran. Read Surahs with translations and tafsir to gain a deeper understanding of the messages and teachings of Islam.
      </Text>

      <Text style={styles.sectionTitle}>99 Names of Allah</Text>
      <Text style={styles.text}>
        Learn and memorize the 99 names of Allah (Asma-ul-Husna). Each name is accompanied by its meaning and a detailed explanation to help you appreciate the attributes of Allah.
      </Text>
      
      <Text style={styles.sectionTitle}>Developers</Text>
      <Text style={styles.text}>
        This app was developed by Said Solsaev.
      </Text>
      
      <Text style={styles.sectionTitle}>Contact</Text>
      <Text style={styles.text}>
        If you have any questions, feedback, or suggestions, please contact me at tooBe@Filled.com.
      </Text>
    </ScrollView>
  )
}

export default AboutScreen

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },

  slogan: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },

  text: {
    fontSize: 16,
    lineHeight: 24,
  },
});
