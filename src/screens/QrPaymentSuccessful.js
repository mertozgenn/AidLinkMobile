import React, { useRef, useEffect, useState } from "react"
import { StyleSheet, Text, View, SafeAreaView, Animated, TouchableOpacity, Platform } from "react-native"
import themeColor from "../theme";
import { navigateByResettingStack } from "../utils/NavigationHelper";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import AsyncStorage from "@react-native-async-storage/async-storage";

const QrPaymentSuccessful = ({navigation}) => {
    const textOpacity = useRef(new Animated.Value(0)).current;
    const [userType, setUserType] = useState('');
    const animationRef = useRef(null);

    useEffect(() => {
        getUserType();
        Animated.timing(textOpacity, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
        }).start();
        if (Platform.OS === 'ios') {
            playHapticFeedback();
        }
        setTimeout(() => {
            animationRef.current?.play();
        }, 500);
    }, []);

    const navigateToHome = () => {
        navigateByResettingStack(navigation, 'Main')
    }

    const getUserType = async () => {
        const userType = await AsyncStorage.getItem('userType');
        setUserType(userType);
    }

    const playHapticFeedback = () => {
        ReactNativeHapticFeedback.trigger("notificationSuccess");
    }
    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.tickContainer}>
            </View>
            <Animated.View style={{ opacity: textOpacity }}>
                {userType == 'member' && <Text style={styles.successTest}>Ödemeniz başarıyla gerçekleşti.</Text>}
                {userType == 'dealer' && <Text style={styles.successTest}>Tahsilat başarıyla gerçekleşti.</Text>}
                <TouchableOpacity onPress={() => navigateToHome()} style={styles.homePageButton}>
                    <Text numberOfLines={1} adjustsFontSizeToFit={true} style={styles.homePageButtonText}>Kapat</Text>
                </TouchableOpacity>
            </Animated.View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 25,
        alignItems: 'center',
    },
    tickContainer: {
        width: 200,
        height: 200,
    },
    successTest: {
        fontSize: 20,
        fontWeight: 'bold',
        color: themeColor,
        fontFamily: 'Poppins-Bold'
    },
    homePageButton: {
        backgroundColor: themeColor,
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
    },
    homePageButtonText: {
        color: '#fff',
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        textAlign: 'center',
    }
})

export default QrPaymentSuccessful