import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, Button, Modal, FlatList, TouchableOpacity, Pressable} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStoredLocation } from '../data/storedData';

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedCalculationMethod, setSelectedCalculationMethod] = useState();
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [darkTheme, setDarkTheme] = useState(false);

  const [calculationMethodModalVisible, setCalculationMethodModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const {setCalculationMethodId} = useStoredLocation();

  const calculationMethods = [
    { label: 'University of Islamic Sciences, Karachi', value: 'UISK', id: '1' },
    { label: 'Islamic Society of North America', value: 'ISNA', id: '2' },
    { label: 'Muslim World League', value: 'MWL', id: '3' },
    { label: 'Umm Al-Qura University, Makkah', value: 'UQ', id: '4' },
    { label: 'Egyptian General Authority of Survey', value: 'EGAS', id: '5' },
    { label: 'Institute of Geophysics, University of Tehran', value: 'UIT', id: '7' },
    { label: 'Gulf Region', value: 'GULF', id: '8' },
    { label: 'Kuwait', value: 'KUWAIT', id: '9' },
    { label: 'Qatar', value: 'QATAR', id: '10' },
    { label: 'Majlis Ugama Islam Singapura, Singapore', value: 'MUIS', id: '11' },
    { label: 'Union Organization islamic de France', value: 'UOIF', id: '12' },
    { label: 'Diyanet İşleri Başkanlığı, Turkey', value: 'DIB', id: '13' },
    { label: 'Spiritual Administration of Muslims of Russia', value: 'SAMR', id: '14' },
    { label: 'Dubai (unofficial)', value: 'DUBAI', id: '16' }
  ];

  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Arabic', value: 'ar' },
    { label: 'Norsk', value: 'no' },
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const notificationsEnabled = await AsyncStorage.getItem('notificationsEnabled');
      if (notificationsEnabled !== null) setNotificationsEnabled(JSON.parse(notificationsEnabled));

      const selectedCalculationMethod = await AsyncStorage.getItem('selectedCalculationMethod');
      if (selectedCalculationMethod !== null) setSelectedCalculationMethod(selectedCalculationMethod);

      const selectedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (selectedLanguage !== null) setSelectedLanguage(selectedLanguage);

      const darkTheme = await AsyncStorage.getItem('darkTheme');
      if (darkTheme !== null) setDarkTheme(JSON.parse(darkTheme));
      
    } catch (error) {
      console.error('Failed to load settings.', error);
    }
  };

  const saveSetting = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save setting.', error);
    }
  };

  const MyModal = ({visible, onClose, data, setData, storageKey}) => {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType='slide'
        onRequestClose={() => onClose(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <FlatList
              data={data}
              keyExtractor={(item) => item.value}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setData(item.value)
                    saveSetting(storageKey, item.value);
                    if (storageKey === 'selectedCalculationMethod') setCalculationMethodId(item.id);
                    onClose(false)
                  }}
                >
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <Button title="Lukk" onPress={() => onClose(false)}/>
          </View>
        </View>
        
      </Modal>
    )
  }

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1, backgroundColor: "#fff"}}>
      <View style={styles.container}>
        
        <View style={styles.setting}>
          <Text style={styles.sectionTitle}>Aktiver varslinger</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={(value) => {
              setNotificationsEnabled(value)
              saveSetting('notificationsEnabled', value);
            }}
          />
        </View>
        
          
        <View style={styles.setting}>
          <Text style={styles.sectionTitle}>Calculation Method</Text>
          <Pressable style={styles.button} onPress={() => setCalculationMethodModalVisible(true)}>
            <Text>{selectedCalculationMethod}</Text>
          </Pressable>
        </View>

        <View style={styles.setting}>
          <Text style={styles.sectionTitle}>Language</Text>
          <Pressable style={styles.button} onPress={() => setLanguageModalVisible(true)}>
            <Text>{selectedLanguage}</Text>
          </Pressable>
        </View>

        <View style={styles.modalContainer}>
          <MyModal
            visible={calculationMethodModalVisible}
            setVisible={setCalculationMethodModalVisible}
            onClose={setCalculationMethodModalVisible}
            data={calculationMethods}
            setData={setSelectedCalculationMethod}
            storageKey="selectedCalculationMethod"
          />
        </View>

        <View style={styles.modalContainer}>
          <MyModal
            visible={languageModalVisible}
            setVisible={setLanguageModalVisible}
            onClose={setLanguageModalVisible}
            data={languages}
            setData={setSelectedLanguage}
            storageKey="selectedLanguage"
          />
        </View>

        <View style={styles.setting}>
          <Text style={styles.sectionTitle}>Dark mode</Text>
          <Switch
            value={darkTheme}
            disabled
            onValueChange={(value) => {
              setDarkTheme(value)
              saveSetting('darkTheme', value)
            }}
          />
        </View>

      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  
  container: {
    padding: 10,
  },
  
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  setting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },

  button: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 16,
  },
  
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 300,
    height: 350
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalItem: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },


  modalItemText: {
    fontSize: 16,
  },
  
  
});

export default SettingsScreen;
