import React, { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { setIsAuthenticated, authError } from '../api/Authentication';
import { getMemberInfo, setMemberInfo } from '../api/Member';

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        initMemberInfo();
    }, []);

    const initMemberInfo = async () => {
        setIsAuthenticated().then(async (result) => {
            if (result) {
                await setMemberInfo(navigation).then(async () => {
                    await getMemberInfo().then(memberInfo => {
                        navigation.replace('Main');
                    });
                });
            }
            else {
                await authError(navigation);
            }
        }).catch(async (error) => {
            await authError(navigation);
        });
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.imageContainer}>
                <Image style={styles.logo} resizeMode='contain' source={require('../assets/images/pause-logo.png')}></Image>
            </View>
            <View style={{ height: 0 }}>
                <ActivityIndicator style={styles.activityIndicator} animating={true} color='#000' size='small'></ActivityIndicator>
            </View>
        </View>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    imageContainer: {
        width: '100%',
        height: 155,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 155,
        height: 155,
    },
    activityIndicator: {
        paddingTop: 40,
    },
});