import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

const BoxContainer = ({title, icon, onPress}) => {
    return (
        <View style={styles.boxContainer}>
            <TouchableOpacity onPress={onPress}>
                <View>
                    {icon}
                </View>
                <Text style={styles.title}>{title}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default BoxContainer

const styles = StyleSheet.create({
    boxContainer: {
        flexDirection: 'column',  
        alignItems: 'center',  
        justifyContent: "center",
        width: 170,
        height: 140,
        padding: 15,  
        margin: 10,  
        backgroundColor: 'white',  
        borderRadius: 10,  
        shadowColor: '#000', 
        shadowOffset: { 
            width: 0, 
            height: 2 
        }, 
        shadowOpacity: 0.25,  
        shadowRadius: 3.84,  
        elevation: 5,
    },
    title: {
        fontSize: 16,  
        fontWeight: 'bold',
        marginTop: 20
    }
    
})