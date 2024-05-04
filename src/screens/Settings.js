import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import openBrowser from "../utils/BrowserHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "../api/Authentication";
import { getMemberInfo } from "../api/Member";
import { ActivityIndicator } from "react-native-paper";
import themeColor from "../theme";

const Settings = ({ navigation }) => {
    const [profileLoading, setProfileLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [memberInfo, setMemberInfo] = useState({});
    useEffect(() => {
        (async () => {
            await getIsAuthenticated();
            await getMember();
        })();
    }, []);
    const getIsAuthenticated = async () => {
        const value = await AsyncStorage.getItem('isAuthenticated');
        setIsAuthenticated(value === 'true');
    }
    const getMember = async () => {
        await getMemberInfo().then(response => {
            setMemberInfo(response);
            setProfileLoading(false);
        });
    }
    const handleLogout = async () => {
        await logout(navigation)
    }
    return (
        <ScrollView style={styles.mainContainer} contentContainerStyle={styles.contentContainerStyle}>
            {(isAuthenticated && profileLoading) && <ActivityIndicator size="small" color={themeColor} />}
            {(isAuthenticated && !profileLoading) && <View style={styles.summaryContainer}>
                <Text numberOfLines={1} adjustsFontSizeToFit={true} style={styles.summaryNameText}>{memberInfo.title}</Text>
                <Text numberOfLines={1} adjustsFontSizeToFit={true} style={styles.summaryNameText}>{memberInfo.name} {memberInfo.surname}</Text>
                <Text numberOfLines={1} adjustsFontSizeToFit={true} style={styles.summaryEmailText}>{memberInfo.email}</Text>
                {memberInfo.recordDate && <Text numberOfLines={1} adjustsFontSizeToFit={true} style={styles.summaryDateText}>Üyelik tarihi: {new Date(memberInfo.recordDate).toLocaleDateString()}</Text>}
            </View>}
            {isAuthenticated && <View>
                <Text numberOfLines={1} adjustsFontSizeToFit={true} style={styles.settingsSectionTitleText}>Hesap</Text>
                <TouchableOpacity style={styles.settingsItemContainer} onPress={() => navigation.navigate("AccountTransactions")}>
                    <Text numberOfLines={1} adjustsFontSizeToFit={true} style={styles.settingsItemTitleText}>Hesap Hareketleri</Text>
                    <Ionicons size={20} color={themeColor} name='chevron-forward' style={styles.forwardIcon} />
                </TouchableOpacity>
            </View>}
            {isAuthenticated &&
                <View>
                    <TouchableOpacity style={styles.logoutButton} onPress={() => handleLogout()}>
                        <Text numberOfLines={1} adjustsFontSizeToFit={true} style={styles.logoutText}>Çıkış</Text>
                    </TouchableOpacity>
                    <Text numberOfLines={1} adjustsFontSizeToFit={true} style={styles.versionText}>Version 1.0.0</Text>
                </View>
            }
        </ScrollView>
    );
}

export default Settings;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#fff"
    },
    contentContainerStyle: {
        padding: 25
    },
    summaryContainer: {
        marginVertical: 20,
    },
    summaryNameText: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: '#202020',
    },
    summaryEmailText: {
        fontSize: 13,
        fontFamily: 'Poppins-SemiBold',
        color: '#202020',
    },
    summaryDateText: {
        fontSize: 13,
        fontFamily: 'Poppins-SemiBold',
        color: '#b3b3b3',
    },
    settingsSectionTitleText: {
        marginVertical: 10,
        fontFamily: 'Poppins-SemiBold',
        color: '#202020',
    },
    settingsItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        height: 40,
    },
    settingsItemTitleText: {
        color: '#202020',
        fontFamily: 'Poppins-Regular',
        alignSelf: 'center',
    },
    forwardIcon: {
        alignSelf: 'center',
    },
    logoutButton: {
        borderRadius: 50,
        borderColor: themeColor,
        borderWidth: 1,
        padding: 10,
        marginTop: 40,
        marginBottom: 10,
        width: 80,
        minHeight: 40,
        alignSelf: 'center',
    },
    logoutText: {
        color: themeColor,
        fontFamily: 'Poppins-Medium',
        alignSelf: 'center',
    },
    versionText: {
        marginTop: 30,
        color: '#b3b3b3',
        fontFamily: 'Poppins-Medium',
        alignSelf: 'center',
    },
});