import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, Button, Modal, FlatList, TouchableOpacity} from 'react-native';


const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedCalculationMethod, setSelectedCalculationMethod] = useState("MWL");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [darkTheme, setDarkTheme] = useState(false);

  const [calculationMethodModalVisible, setCalculationMethodModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const calculationMethods = [
    { label: 'Muslim World League', value: 'MWL' },
    { label: 'Umm al-Qura', value: 'UQ' },
    { label: 'University of Islamic Sciences, Karachi', value: 'UISK' },
  ];

  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Arabic', value: 'ar' },
    { label: 'French', value: 'fr' },
  ];

  console.log(selectedCalculationMethod)

  const MyModal = ({visible, onClose, data, setData}) => {
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
    <ScrollView >
      <View style={styles.container}>
        
        <View style={styles.setting}>
          <Text style={styles.sectionTitle}>Aktiver varslinger</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={(value) => setNotificationsEnabled(value)}
          />
        </View>
        
          
        <View style={styles.setting}>
          <Text style={styles.sectionTitle}>Calculation Method</Text>
          <Button title={selectedCalculationMethod} style={styles.button} onPress={() => setCalculationMethodModalVisible(true)}/>
        </View>

        <View style={styles.setting}>
          <Text style={styles.sectionTitle}>Language</Text>
          <Button title={selectedLanguage} style={styles.button} onPress={() => setLanguageModalVisible(true)}/>

        </View>

        <View style={styles.modalContainer}>
          <MyModal
            visible={calculationMethodModalVisible}
            setVisible={setCalculationMethodModalVisible}
            onClose={setCalculationMethodModalVisible}
            data={calculationMethods}
            setData={setSelectedCalculationMethod}
          />
        </View>

        <View style={styles.modalContainer}>
          <MyModal
            visible={languageModalVisible}
            setVisible={setLanguageModalVisible}
            onClose={setLanguageModalVisible}
            data={languages}
            setData={setSelectedLanguage}
          />
        </View>

        <View style={styles.setting}>
          <Text style={styles.sectionTitle}>Dark mode</Text>
          <Switch
            value={darkTheme}
            onValueChange={(value) => setDarkTheme(value)}
          />
        </View>

      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
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
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },


  modalItemText: {
    fontSize: 18,
  },
  
  
});

export default SettingsScreen;
