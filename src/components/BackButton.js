import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default function BackButton({ navigation}) {
    return (
        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.goBack()}>
            <Ionicons size={25} color={'black'} name='chevron-back-outline' />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        paddingRight: 20
    }
})
