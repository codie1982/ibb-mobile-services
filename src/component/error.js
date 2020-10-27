import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function Error(props) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{props.message}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        alignSelf:"center",
        width:"80%"
    },
    text:{
        textAlign:"center"

    }
    
})


