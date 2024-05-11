import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'

const LoadingSircle = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="green" />
            <Text>Laster inn data...</Text>
        </View>
    )
}

export default LoadingSircle

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    }
})