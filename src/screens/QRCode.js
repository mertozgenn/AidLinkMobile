import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, RefreshControl } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getQrCode } from '../api/Account';
import { toastConfig } from '../utils/ToastHelper';
import Toast from 'react-native-toast-message';
import themeColor from '../theme';
import { getCurrentMemberInfo } from '../api/Member';
import { formatNumber } from '../utils/Utils';

const QRCode = ({ navigation }) => {
    const [qrCode, setQrCode] = useState();
    const [qrCodeLoading, setQrCodeLoading] = useState(true);
    const [memberInfo, setMemberInfo] = useState();
    const [memberInfoLoading, setMemberInfoLoading] = useState(true);
    let currentBalance = 0;

    useEffect(() => {
        (async () => {
            getQr();
            getBalance();
            let intervalId = checkPaymentDone();
            registerRemoveIntervalEvent(intervalId);
        })()
    }, []);

    const getQr = async () => {
        await getQrCode().then((value) => {
            setQrCode(value);
            setQrCodeLoading(false);
        }, (error) => {
            console.log(error);
        });
    };

    const getBalance = async () => {
        const memberInfo = await getCurrentMemberInfo();
        currentBalance = memberInfo.totalBalance;
        setMemberInfo(memberInfo);
        setMemberInfoLoading(false);
    }

    const checkPaymentDone = () => (setInterval(async () => {
        let oldBalance = currentBalance;
        await getBalance();
        if (oldBalance !== currentBalance) {
            navigation.replace("QrPaymentSuccessful");
        }
    }, 2000));


    const registerRemoveIntervalEvent = (id) => {
        navigation.addListener('beforeRemove', () => {
            clearInterval(id);
        })
    }

    // refreshing
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        (async () => {
            if (refreshing) {
                getQr();
                await getTotalAccounts();
                await getGiftDrinkPlusCostData();
                calculateGiftDrink();
                setRefreshing(false);
            }
        })();
    }, [refreshing]);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
    }, []);
    return (
        <>
            <ScrollView style={styles.mainContainer}
                contentContainerStyle={styles.contentContainerStyle}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={styles.qrContainer}>
                    {qrCodeLoading && <ActivityIndicator animating={true} color={themeColor} />}
                    {qrCode && <Image style={styles.image} source={{ uri: qrCode }}></Image>}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={styles.buttonTextContainer}>
                        {memberInfoLoading && <ActivityIndicator animating={true} color={themeColor} />}
                        {(!memberInfoLoading && memberInfo) &&
                            <View style={styles.row}>
                                <Text maxFontSizeMultiplier={2} adjustsFontSizeToFit={true} numberOfLines={1} style={styles.buttonText}>{formatNumber(memberInfo.totalBalance)}</Text>
                                <MaterialCommunityIcons name="currency-try" size={15} color="#212121" />
                            </View>
                        }
                    </View>
                </View>
            </ScrollView>
            <Toast config={toastConfig} />
        </>
    );
}

export default QRCode;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },
    contentContainerStyle: {
        padding: 25
    },
    image: {
        width: undefined,
        height: '100%',
        aspectRatio: 1,
    },
    qrContainer: {
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: '33%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    iconContainer: {
        height: 80,
        justifyContent: 'center',
    },
    buttonText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        color: '#212121',
        textAlign: 'center',
    },
    buttonTextContainer: {
        width: '100%',
        minHeight: 40,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    plusIcon: {
        width: 50,
        height: 50,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
})