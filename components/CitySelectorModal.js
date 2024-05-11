import { Modal, StyleSheet, FlatList, TouchableOpacity, Text, TextInput, View } from 'react-native'
import React, {useState} from 'react'

const CitySelectorModal = ({visible, onClose, onSelectCity }) => {
    const [search, setSearch] = useState('');
    const [cities, setCities] = useState([
        'Oslo', 'Bergen', 'Trondheim', 'Stavanger', 
        'Kristiansand', 'Tromsø', 'Drammen', 
        'Fredrikstad', 'Porsgrunn', 'Skien', 
        'Bodø', 'Ålesund', 'Haugesund'
    ]);

    // Filtrer byer basert på søketekst
    const filteredCities = cities.filter(city => city.toLowerCase().includes(search.toLowerCase()));



    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TextInput 
                        style={styles.input}
                        placeholder="Søk etter by..."
                        value={search}
                        onChangeText={setSearch}
                    />

                    <FlatList 
                        style={{width: "100%"}}
                        data={filteredCities}
                        keyExtractor={item => item}
                        renderItem={({item}) => (
                            <TouchableOpacity onPress={() => onSelectCity(item)}>
                                <Text style={styles.cityName}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />

                    <TouchableOpacity onPress={onClose} style={styles.button}>
                        <Text style={styles.buttonText}>Lukk</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </Modal>
    )
}

export default CitySelectorModal

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
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
      input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        width: '100%',
        marginBottom: 20,
        color: "black",
      },
      cityName: {
        fontSize: 18,
        margin: 10,
      },
      button: {
        backgroundColor: "red",
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        marginTop: 15,
      },
      buttonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    }

})