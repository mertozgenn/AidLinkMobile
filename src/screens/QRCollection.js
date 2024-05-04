import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { toastConfig } from '../utils/ToastHelper';
import Toast from 'react-native-toast-message';
import { useCameraDevice, useCodeScanner } from 'react-native-vision-camera'
import { Camera } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/core'
import { useIsForeground } from '../hooks/useIsForeground'
import { TextInput } from 'react-native-paper';
import themeColor from '../theme';
import { showErrorToast } from '../utils/ToastHelper';
import { qrPayment } from '../api/Payment';

const QRCollection = ({ navigation }) => {
    const [collectionAmount, setCollectionAmount] = useState('');
    const [cameraShown, setCameraShown] = useState(false);
    const qrScanned = useRef(false);

    const device = useCameraDevice('back')
    const isFocused = useIsFocused()
    const isForeground = useIsForeground()
    const isActive = isFocused && isForeground

    useEffect(() => {
        (async () => {
            await requestCameraPermission()
        })()
    }, []);


    const onCodeScanned = async (codes) => {
        const value = codes[0]?.value
        if (qrScanned.current) return
        qrScanned.current = true
        var result = await qrPayment({ qRText: value, collectionAmount: parseFloat(collectionAmount) });
        if (result.success == true) {
            setTimeout(() => {
                navigation.replace("QrPaymentSuccessful");
            }, 1000);
        }
        else {
            showErrorToast('Hata', result.message);
        }
        if (value == null) return

    }
    const codeScanner = useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned: onCodeScanned,
    })

    const requestCameraPermission = useCallback(async () => {
        console.log('Requesting camera permission...')
        const permission = await Camera.requestCameraPermission()
        console.log(`Camera permission status: ${permission}`)

        if (permission === 'denied') await Linking.openSettings()
    }, [])

    const handleAmountEntered = () => {
        if (collectionAmount == '') {
            showErrorToast('Hata', 'Lütfen tahsilat tutarını giriniz.');
            return;
        }
        if (parseFloat(collectionAmount) <= 0) {
            showErrorToast('Hata', 'Tahsilat tutarı sıfırdan büyük olmalıdır.');
            return;
        }
        setCameraShown(true);
    }
    return (
        <>
            <ScrollView style={styles.mainContainer}
                contentContainerStyle={styles.contentContainerStyle}>
                {!cameraShown && <View>
                    <Text style={styles.header}>Tahsilat Tutarı</Text>
                    <TextInput
                        label="Tahsilat Tutarı"
                        value={collectionAmount.toString()}
                        onChangeText={text => {
                            if (text == '') {
                                setCollectionAmount(0);
                                return;
                            }
                            setCollectionAmount(parseFloat(text));
                        }}
                        style={styles.inputStyle}
                        activeUnderlineColor={themeColor}
                        contentStyle={styles.inputContentStyle}
                        keyboardType='numeric'
                        autoCapitalize='none'
                        autoCorrect={false}
                        inputMode='decimal'
                    />
                    <View>
                        <TouchableOpacity style={styles.button} onPress={() => handleAmountEntered()}>
                            <Text style={styles.buttonText}>Devam</Text>
                        </TouchableOpacity>
                    </View>
                </View>}
                {cameraShown &&
                    <View>
                        <Text style={styles.header}>QR Kodu Okutunuz</Text>
                        <View style={styles.qrContainer}>
                            {device != null && (
                                <Camera
                                    style={styles.image}
                                    device={device}
                                    isActive={isActive}
                                    codeScanner={codeScanner}
                                    enableZoomGesture={true}
                                    onError={(error) => { }}
                                />
                            )}
                        </View>
                    </View>}
            </ScrollView>
            <Toast config={toastConfig} />
        </>
    );
}

export default QRCollection;

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
        height: 400,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontFamily: 'Poppins-Bold',
        fontSize: 20,
        color: '#000',
    },
    inputStyle: {
        backgroundColor: 'transparent',
        marginBottom: 20,
        marginLeft: 0,
    },
    inputContentStyle: {
        color: '#202020',
        fontFamily: 'Poppins-Bold',
        fontSize: 17,
    },
    button: {
        backgroundColor: themeColor,
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
        minHeight: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15,
        textAlign: 'center',
    },
})