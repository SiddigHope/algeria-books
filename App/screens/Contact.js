import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'

export default class Contact extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={{ backgroundColor: '#32899F', borderRadius:20, color:'#e3e3e3', padding: 20, fontFamily:'Tajawal-Bold'}}> {'قريبا...'} </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#FFF',
        justifyContent:"center",
        alignItems: "center",
        height:'100%',
        width: '100%'
    }
})
