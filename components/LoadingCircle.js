import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'

export const LoadingCircle = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="green" />
            <Text>Laster inn data...</Text>
        </View>
    )
}


export const LoadingCircleSmall = ({text}) => {
    return (
        <View style={styles.smallContainer}>
            <ActivityIndicator size="small" color="green" />
            <Text>{text ? text : 'Laster inn data...'}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    smallContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    }
})